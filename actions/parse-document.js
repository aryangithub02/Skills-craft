"use server";

import mammoth from "mammoth";
import zlib from "zlib";

/**
 * Robust PDF text extractor using pdf2json & zlib stream decompression
 */
async function extractTextFromPdfBuffer(buffer) {
  // Tier 1: Try pdf2json
  try {
    const PDFParser = require("pdf2json");
    const parser = new PDFParser(null, 1);

    const pdfText = await new Promise((resolve, reject) => {
      parser.on("pdfParser_dataError", (errData) => reject(errData.parserError || errData));
      parser.on("pdfParser_dataReady", () => {
        const raw = parser.getRawTextContent();
        resolve(raw);
      });
      parser.parseBuffer(buffer);
    });

    if (pdfText && pdfText.trim().length > 20) {
      return pdfText;
    }
  } catch (err) {
    console.warn("⚠️ pdf2json notice:", err.message || err);
  }

  // Tier 2: Decompress FlateDecode streams using zlib
  try {
    let combinedText = "";
    const bufStr = buffer.toString("binary");
    const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
    let match;

    while ((match = streamRegex.exec(bufStr)) !== null) {
      const streamBytes = Buffer.from(match[1], "binary");
      try {
        const decompressed = zlib.inflateSync(streamBytes).toString("utf-8");
        const textTokens = decompressed.match(/\((.*?)\)|\[(.*?)\]/g) || [];
        const cleanTokens = textTokens
          .map(t => t.replace(/[()\[\]]/g, "").trim())
          .filter(t => t.length > 1 && !t.startsWith("\\"));
        combinedText += " " + cleanTokens.join(" ");
      } catch (e) {
        const textTokens = match[1].match(/[A-Za-z0-9\s.,@():\/\\_\-+]{3,}/g) || [];
        combinedText += " " + textTokens.join(" ");
      }
    }

    if (combinedText && combinedText.trim().length > 20) {
      return combinedText;
    }
  } catch (zErr) {
    console.warn("⚠️ zlib stream decompression notice:", zErr.message);
  }

  // Tier 3: Plain text filter fallback
  const rawStr = buffer.toString("utf-8");
  const matches = rawStr.match(/[A-Za-z0-9\s.,@():\/\\_\-+]{3,}/g) || [];
  return matches.filter(s => 
    !s.includes("FlateDecode") && 
    !s.includes("FontDescriptor") && 
    !s.includes("MediaBox") &&
    s.trim().length > 3
  ).join(" ");
}

/**
 * Server Action to parse uploaded PDF or DOCX file buffer into clean human text
 */
export async function parseDocumentAction(formData) {
  try {
    const file = formData.get("file");
    if (!file) throw new Error("No file provided.");

    // Enforce 10MB document size limit
    const MAX_DOC_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_DOC_SIZE) {
      throw new Error("File size exceeds maximum allowed threshold of 10MB.");
    }

    const fileName = file.name || "";
    const buffer = Buffer.from(await file.arrayBuffer());

    let extractedText = "";

    // 1. PDF Parsing
    if (fileName.endsWith(".pdf") || file.type === "application/pdf") {
      extractedText = await extractTextFromPdfBuffer(buffer);
    }
    // 2. DOCX Parsing
    else if (fileName.endsWith(".docx") || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const docxData = await mammoth.extractRawText({ buffer });
      extractedText = docxData.value || "";
    }
    // 3. Plain Text / Markdown
    else {
      extractedText = buffer.toString("utf-8");
    }

    const cleanText = extractedText
      .replace(/\r\n/g, "\n")
      .replace(/\t/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    console.log(`📄 [Parse Document] Successfully extracted ${cleanText.length} characters from ${fileName}`);
    return { success: true, text: cleanText, fileName };
  } catch (err) {
    console.error("❌ Document Parsing Error:", err);
    return { success: false, error: err.message || "Failed to parse document text." };
  }
}
