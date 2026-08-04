"""
SkillsCraft Speech-to-Text & Audio Storage Backend
==================================================
FastAPI + Faster-Whisper server for transcription + audio recording storage.

Usage:
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload
"""

from __future__ import annotations

import io
import os
import time
import uuid
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Optional

import ffmpeg
from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from loguru import logger
from pydantic import BaseModel, Field

# Load env vars from .env (next to this file)
load_dotenv(Path(__file__).resolve().parent / ".env")

# Directory setup for audio storage
BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads" / "audio"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

class Settings(BaseModel):
    """Application settings."""
    host: str = Field(default="0.0.0.0", description="Server bind address")
    port: int = Field(default=8000, ge=1, le=65535, description="Server port")
    whisper_model_size: str = Field(default="medium", description="Model size: tiny, base, small, medium, large-v3")
    whisper_compute_type: str = Field(default="int8", description="Compute type: float16, int8, float32")
    whisper_device: str = Field(default="auto", description="Device: cpu, cuda, auto")
    whisper_language: str = Field(default="en", description="Language code")
    cors_origins: str = Field(default="http://localhost:3000", description="Allowed CORS origins")

    @property
    def cors_origin_list(self) -> list[str]:
        origins = [o.strip() for o in self.cors_origins.split(",") if o.strip()]
        if "*" in origins:
            return ["*"]
        return origins


settings = Settings(
    host=os.getenv("HOST", "0.0.0.0"),
    port=int(os.getenv("PORT", "8000")),
    whisper_model_size=os.getenv("WHISPER_MODEL_SIZE", "medium"),
    whisper_compute_type=os.getenv("WHISPER_COMPUTE_TYPE", "int8"),
    whisper_device=os.getenv("WHISPER_DEVICE", "auto"),
    whisper_language=os.getenv("WHISPER_LANGUAGE", "en"),
    cors_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000"),
)

logger.info("🔧 Settings loaded:")
logger.info(f"   Model       : {settings.whisper_model_size}")
logger.info(f"   Upload Dir  : {UPLOAD_DIR}")
logger.info(f"   CORS origins: {settings.cors_origin_list}")

# ---------------------------------------------------------------------------
# Model Singleton
# ---------------------------------------------------------------------------

MODEL = None


def load_model():
    """Load the Faster-Whisper model singleton on startup."""
    global MODEL
    if MODEL is not None:
        return MODEL

    from faster_whisper import WhisperModel

    logger.info(f"⏳ Loading Faster-Whisper model '{settings.whisper_model_size}'...")
    start = time.time()

    MODEL = WhisperModel(
        model_size_or_path=settings.whisper_model_size,
        device=settings.whisper_device,
        compute_type=settings.whisper_compute_type,
        local_files_only=False,
    )

    logger.info(f"✅ Model loaded in {time.time() - start:.1f}s")
    return MODEL


def unload_model():
    global MODEL
    if MODEL is not None:
        MODEL = None
        import gc
        gc.collect()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Application starting up...")
    try:
        load_model()
    except Exception as e:
        logger.warning(f"Whisper model deferred: {e}")
    yield
    unload_model()


# ---------------------------------------------------------------------------
# FastAPI Application
# ---------------------------------------------------------------------------

app = FastAPI(
    title="SkillsCraft Speech-to-Text & Audio Recording API",
    version="2.0.0",
    lifespan=lifespan,
)

# Serve uploaded audio files
app.mount("/uploads", StaticFiles(directory=BASE_DIR / "uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Request / Response Models
# ---------------------------------------------------------------------------

class Segment(BaseModel):
    start: float = 0.0
    end: float = 0.0
    text: str = ""
    confidence: Optional[float] = None


class TranscribeResponse(BaseModel):
    transcript: str = ""
    language: str = "en"
    language_probability: Optional[float] = None
    duration_seconds: float = 0.0
    segments: list[Segment] = Field(default_factory=list)
    filename: Optional[str] = None
    audio_url: Optional[str] = None


class HealthResponse(BaseModel):
    status: str = "ok"
    model_size: str = settings.whisper_model_size
    upload_dir: str = str(UPLOAD_DIR)


# ---------------------------------------------------------------------------
# Utility: audio conversion
# ---------------------------------------------------------------------------

def get_ffmpeg_executable() -> str:
    import shutil
    ffmpeg_cmd = shutil.which("ffmpeg")
    if ffmpeg_cmd:
        return ffmpeg_cmd
    try:
        import sys
        user_site = os.path.expanduser(r"~\AppData\Roaming\Python\Python313\site-packages")
        if user_site not in sys.path:
            sys.path.append(user_site)
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        return "ffmpeg"


def convert_audio_to_wav(input_bytes: bytes, sample_rate: int = 16000) -> bytes:
    ffmpeg_exe = get_ffmpeg_executable()
    try:
        process = (
            ffmpeg
            .input("pipe:0")
            .output(
                "pipe:1",
                format="wav",
                acodec="pcm_s16le",
                ac=1,
                ar=sample_rate,
            )
            .overwrite_output()
            .run_async(cmd=ffmpeg_exe, pipe_stdin=True, pipe_stdout=True, pipe_stderr=True)
        )
        out, _ = process.communicate(input=input_bytes)
        return out if out else input_bytes
    except Exception as ex:
        logger.error(f"Audio conversion notice: {ex}")
        return input_bytes


async def run_transcription(audio_bytes: bytes, language: str = None) -> tuple[str, str, float, list[Segment]]:
    import asyncio
    model = load_model()
    wav_bytes = await asyncio.to_thread(convert_audio_to_wav, audio_bytes)
    lang_param = None if (language or settings.whisper_language).lower() == "auto" else (language or settings.whisper_language)

    audio_stream = io.BytesIO(wav_bytes)

    segments, info = await asyncio.to_thread(
        model.transcribe,
        audio_stream,
        language=lang_param,
        beam_size=5,
        best_of=5,
        temperature=0.0,
        vad_filter=False,
        condition_on_previous_text=False,
    )

    detected_language = info.language if info else "en"
    lang_probability = info.language_probability if info else 1.0
    audio_duration = info.duration if info else 0.0

    segment_list: list[Segment] = []
    all_text_parts: list[str] = []

    for seg in segments:
        segment_list.append(
            Segment(
                start=round(seg.start, 2),
                end=round(seg.end, 2),
                text=seg.text.strip(),
                confidence=round(seg.avg_logprob, 4) if hasattr(seg, "avg_logprob") else None,
            )
        )
        all_text_parts.append(seg.text.strip())

    full_transcript = " ".join(all_text_parts).strip()
    return full_transcript, detected_language, audio_duration, segment_list


# ---------------------------------------------------------------------------
# API Endpoints
# ---------------------------------------------------------------------------

@app.get("/api/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    return HealthResponse(
        status="ok",
        model_size=settings.whisper_model_size,
        upload_dir=str(UPLOAD_DIR),
    )


@app.post("/api/transcribe", response_model=TranscribeResponse, tags=["Transcription"])
async def transcribe_and_save_audio(
    audio: UploadFile = File(..., description="Audio file (webm, ogg, wav, mp3, etc.)"),
    language: str = Form(default=None),
):
    """
    Save candidate's recorded audio file AND transcribe speech to text.
    """
    request_id = uuid.uuid4().hex[:8]
    logger.info(f"[{request_id}] 📥 Received file: {audio.filename} ({audio.content_type})")

    raw_bytes = await audio.read()
    if len(raw_bytes) == 0:
        return TranscribeResponse(
            transcript="",
            language="en",
            duration_seconds=0.0,
        )

    ext = ".webm"
    if audio.filename:
        _, file_ext = os.path.splitext(audio.filename)
        if file_ext:
            ext = file_ext

    saved_filename = f"voice_{int(time.time())}_{uuid.uuid4().hex[:6]}{ext}"
    saved_path = UPLOAD_DIR / saved_filename
    
    with open(saved_path, "wb") as f:
        f.write(raw_bytes)

    audio_url = f"/uploads/audio/{saved_filename}"

    transcript_text = ""
    detected_lang = "en"
    duration = 0.0
    segment_list = []

    try:
        transcript_text, detected_lang, duration, segment_list = await run_transcription(raw_bytes, language=language)
        logger.info(f"[{request_id}] ✅ Transcribed — '{transcript_text[:80]}...'")
    except Exception as e:
        logger.warn(f"[{request_id}] Transcription fallback: {e}")

    return TranscribeResponse(
        transcript=transcript_text,
        language=detected_lang,
        language_probability=1.0,
        duration_seconds=round(duration, 2),
        segments=segment_list,
        filename=saved_filename,
        audio_url=audio_url,
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=os.getenv("UVICORN_RELOAD", "false").lower() == "true",
        log_level="info",
    )
