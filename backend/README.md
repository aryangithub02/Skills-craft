# 🎤 SkillsCraft Speech-to-Text Backend (FastAPI + Faster-Whisper)

This directory contains a self-hosted, high-performance speech-to-text server using **FastAPI** and **Faster-Whisper** (CTranslate2-based Whisper inference).

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  Browser (MediaRecorder API)                        │
│  ┌─────────────────────────────────────────────┐   │
│  │  useSpeechRecognition() hook                 │   │
│  │  → Records audio via MediaRecorder           │   │
│  │  → Sends audio chunks to FastAPI backend     │   │
│  │  → Progressive & final transcription         │   │
│  └──────────────┬──────────────────────────────┘   │
└─────────────────┼───────────────────────────────────┘
                  │  POST /api/transcribe (multipart audio)
                  ▼
┌──────────────────────────────────────────────────────┐
│  FastAPI Server (port 8000)                          │
│  ┌──────────────────────────────────────────────┐   │
│  │  Faster-Whisper (Model loaded at startup)     │   │
│  │  → ffmpeg audio conversion (16kHz mono WAV)  │   │
│  │  → Speech-to-text with VAD filtering         │   │
│  │  → Language detection, punctuation           │   │
│  │  → Word-level timestamps                     │   │
│  └──────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────┘
```

## Prerequisites

- **Python 3.10+**
- **ffmpeg** installed on your system:
  - **Windows**: `winget install ffmpeg` or download from [ffmpeg.org](https://ffmpeg.org/)
  - **macOS**: `brew install ffmpeg`
  - **Linux**: `sudo apt install ffmpeg`
- **~4-6 GB RAM** (for the `medium` model; less for smaller models)

## Setup

### 1. Create virtual environment

```bash
cd backend
python -m venv venv
source venv/bin/activate    # Linux/macOS
# OR
venv\Scripts\activate       # Windows
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env if needed (model size, port, etc.)
```

## Running the Server

### Development (with hot-reload)

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Production

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 2
```

The server will:
1. Download the Whisper model on first run (cached in `~/.cache/whisper/`)
2. Start listening on port 8000
3. Accept transcription requests from the Next.js frontend

## API Endpoints

### `POST /api/transcribe`

Upload an audio file for transcription.

**Request**: `multipart/form-data` with an `audio` field containing the audio file.

**Example using curl**:
```bash
curl -X POST http://localhost:8000/api/transcribe \
  -F "audio=@recording.webm"
```

**Response**:
```json
{
  "transcript": "The quick brown fox jumps over the lazy dog.",
  "language": "en",
  "language_probability": 0.98,
  "duration_seconds": 3.45,
  "segments": [
    {"start": 0.0, "end": 1.2, "text": "The quick brown fox", "confidence": -0.08},
    {"start": 1.2, "end": 3.45, "text": "jumps over the lazy dog.", "confidence": -0.05}
  ]
}
```

### `GET /api/health`

Health check — confirms the server and model are running.

```json
{
  "status": "ok",
  "model_size": "medium",
  "device": "auto",
  "compute_type": "float16"
}
```

## Configuration

Edit `backend/.env`:

| Variable | Default | Description |
|----------|---------|-------------|
| `HOST` | `0.0.0.0` | Bind address |
| `PORT` | `8000` | Server port |
| `WHISPER_MODEL_SIZE` | `medium` | Model: tiny, base, small, medium, large-v3 |
| `WHISPER_COMPUTE_TYPE` | `float16` | float16 (GPU), int8 (CPU), float32 |
| `WHISPER_DEVICE` | `auto` | cpu, cuda, auto |
| `WHISPER_LANGUAGE` | `en` | Language or "auto" for auto-detect |
| `CORS_ORIGINS` | `http://localhost:3000` | Allowed origins (comma-separated) |

## Model Sizes & Performance

| Model | Params | RAM | Speed (GPU) | Accuracy |
|-------|--------|-----|-------------|----------|
| `tiny` | 39M | ~1 GB | Very fast | Basic |
| `base` | 74M | ~2 GB | Fast | Fair |
| `small` | 244M | ~4 GB | Moderate | Good |
| `medium` | 769M | ~6 GB | Slower | Very good |
| `large-v3` | 1.55B | ~12 GB | Slow | Best |

## Troubleshooting

**"ffmpeg not found"**: Install ffmpeg on your system and ensure it's in your PATH.

**Out of memory**: Use a smaller model (`small` or `base`) in `.env`.

**CUDA not available**: Set `WHISPER_DEVICE=cpu` and `WHISPER_COMPUTE_TYPE=int8` in `.env`.

**Model download fails**: Ensure you have internet access for the first run. The model is cached after download.
