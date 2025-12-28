// backend/index.js
// Fully patched Saral Lipi backend (multi-image ready)

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { createWorker } = require('tesseract.js');
const pdf = require('pdf-parse');
const axios = require('axios');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    files: 5,                     // max number of files
    fileSize: 5 * 1024 * 1024     // 5 MB per file
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype.startsWith("image/")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and image files are allowed"));
    }
  }
});

// ===============================
//    MODEL INITIALIZATION
// ===============================
async function initGenerativeModel() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY missing");

  const chosenModelName = "models/gemini-2.5-flash";
  console.log("Using FAST model:", chosenModelName);

  const genAI = new GoogleGenerativeAI(key);
  return genAI.getGenerativeModel({ model: chosenModelName });
}

let generativeModelPromise = initGenerativeModel().catch(err => {
  console.error("Model init failed:", err);
  return Promise.reject(err);
});

// ===============================
//   PROCESS MULTIPLE FILES
// ===============================
app.post('/api/process', upload.array('documents', 5), async (req, res) => {
  try {
    const files = req.files;   // <-- Correct!
    const processingMode = req.body.mode;
    const outputLanguage = req.body.language;

    if (!files || files.length === 0)
      return res.status(400).json({ error: 'No files uploaded' });

    const model = await generativeModelPromise;
    const results = [];

    for (const file of files) {
      console.log(`Processing: ${file.originalname}`);

      // --------- 1) OCR / PDF TEXT EXTRACTION ----------
      let extractedText = "";

      if (file.mimetype === "application/pdf") {
        const data = await pdf(file.buffer);
        extractedText = data.text || "";
      } 
      else if (file.mimetype.startsWith("image/")) {
        const worker = await createWorker('eng');
        const ret = await worker.recognize(file.buffer);
        await worker.terminate();
        extractedText = ret?.data?.text || "";
      } 
      else {
        results.push({
          filename: file.originalname,
          error: "Unsupported file type"
        });
        continue;
      }

      let simplifiedText = extractedText;
      let translatedText = extractedText;

      // --------- 2) SIMPLIFY ----------
      if ((processingMode === "simplify" || processingMode === "translate") &&
          extractedText.trim().length > 0) {
        
        const prompt = `
You are a lawyer explaining a document to a non-lawyer.

STRICT RULES (NO EXCEPTIONS):
- Use ONLY information present in the document.
- Do NOT add introductions, greetings, or warnings.
- Do NOT explain obvious things.
- Do NOT repeat or narrate the document.
- Do NOT add advice that is not written in the document.
- If something is not mentioned, write: "Not specified in the document."
- Keep everything short and factual.

FORMAT REQUIREMENT (MANDATORY):
- Use Markdown formatting.
- All section titles MUST be bold.
- Bullet points must use hyphens (-).
- Do NOT write paragraphs longer than 2 lines.
- Always start with a "What This Document Is" section.
OUTPUT FORMAT (FOLLOW EXACTLY):

**What This Document Is**
- Maximum 1 sentence.

**What You Are Agreeing To **
- Maximum 8 bullet points.(if less, that's fine)
- Each bullet must be one short line.
- No explanations under bullets.

**Your Rights Under This Document**
- Maximum 8 bullet points.(if less, that's fine)
- Only rights stated or clearly implied.

**Risks and Important Conditions**
- Maximum 8 bullet points.(if less, that's fine)
- Use ⚠ only for serious risks.
- No explanations under bullets.

**One-Line Explanation**
- Exactly ONE sentence.
- Simple language.
- No commas.

LENGTH CONTROL:
- The full output must be readable in under one minute.
- Even if the document is long, do NOT exceed limits.

PROHIBITED:
- No examples
- No step-by-step explanations
- No moral advice
- No external laws unless named in the document



${extractedText}
        `;

        const aiResult = await model.generateContent(prompt);

        try {
          simplifiedText = aiResult?.response?.text?.()
            || aiResult?.response?.[0]?.content?.[0]?.text
            || aiResult?.candidates?.[0]?.content
            || JSON.stringify(aiResult);
        } catch {
          simplifiedText = JSON.stringify(aiResult);
        }
      }

      // --------- 3) TRANSLATE ----------
      if (processingMode === "translate" && simplifiedText.trim()) {
        const translationPrompt = `
Translate the following simplified text without adding any extra line in the beginning to **${outputLanguage}**:

${simplifiedText}
        `;

        const translationResult = await model.generateContent(translationPrompt);

        try {
          translatedText = translationResult?.response?.text?.()
            || translationResult?.response?.[0]?.content?.[0]?.text
            || translationResult?.candidates?.[0]?.content
            || JSON.stringify(translationResult);
        } catch {
          translatedText = JSON.stringify(translationResult);
        }
      }

      // --------- SAVE RESULT FOR THIS FILE ----------
      results.push({
        filename: file.originalname,
        rawText: extractedText,
        simplifiedText,
        translatedText
      });
    }

    // Return final output
    res.json({
      message: "All documents processed successfully",
      mode: processingMode,
      language: outputLanguage,
      results   // <--- Array of all processed files
    });

  } catch (error) {
    console.error("Processing error:", error);
    res.status(500).json({ error: "Failed to process documents" });
  }
});


// ===============================
//     ASK ENDPOINT (unchanged)
// ===============================
const referencedFileUrl = 'file:///mnt/data/models.json';

app.post('/api/ask', express.json(), async (req, res) => {
  const greetingRegex = /^(hi|hello|hey|hai|good morning|good afternoon|good evening)$/i;


  try {
    const { question, contextText = "" } = req.body;

    // 1️⃣ Handle greetings FIRST (no document needed)
    if (question && greetingRegex.test(question.trim())) {
      return res.json({
        answer: "Hello! 😊 You can ask me anything about this document."
      });
    }
    if (!question || !contextText)
      return res.status(400).json({ error: "Missing question or context" });

    const model = await generativeModelPromise;

    const prompt = `
You are an assistant answering strictly from the provided text.

Document reference: ${referencedFileUrl}

Context:
${contextText}

Question: ${question}

Answer concisely. If answer is not found, say: "Not found in the document."
`;

    const aiResult = await model.generateContent(prompt);

    let answer = "";
    try {
      answer = aiResult?.response?.text?.()
        || aiResult?.response?.[0]?.content?.[0]?.text
        || aiResult?.candidates?.[0]?.content
        || JSON.stringify(aiResult);
    } catch {
      answer = JSON.stringify(aiResult);
    }

    res.json({ question, answer });

  } catch (err) {
    console.error("Error in /api/ask:", err);
    res.status(500).json({ error: "Failed to answer question" });
  }
});

app.listen(port, () => {
  console.log(`Saral Lipi backend running at http://localhost:${port}`);
});
