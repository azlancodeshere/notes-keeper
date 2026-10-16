import { GoogleGenAI } from "@google/genai";
 
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error("GEMINI_API_KEY is missing");
 
const ai = new GoogleGenAI({ apiKey });
 
const MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.5-flash",
  "gemini-3.7-flash",
  "gemini-3.8-flash",
];
 
const MAX_ATTEMPTS_PER_MODEL = 2;
const MAX_PROMPT_LENGTH = 2000;
const MAX_NOTE_LENGTH = 20000;
 
const SYSTEM_INSTRUCTION = `
You are NotesKeeper AI, an intelligent study assistant.
Help the user understand their notes in simple language.
Reply in Hindi or English according to the user's question.
For programming questions, explain concepts clearly with short examples.
If the question is unrelated to the note, still answer helpfully.
`.trim();
 
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
 

const isRetryable = (error) => error?.status === 503 || error?.status === 429;
 

const isModelUnavailable = (error) => error?.status === 404;
 
const generateWithFallback = async (contents) => {
  let lastError;
 
  for (const model of MODELS) {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS_PER_MODEL; attempt++) {
      try {
        return await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });
      } catch (error) {
        lastError = error;
 
        if (isModelUnavailable(error)) {
          console.warn(`[AI] ${model} not available, skipping.`);
          break;
        }
 
        
        if (!isRetryable(error)) throw error;
 
        console.warn(
          `[AI] ${model} busy (attempt ${attempt}/${MAX_ATTEMPTS_PER_MODEL})`
        );
        await sleep(1000 * attempt);
      }
    }
  }
 
  throw lastError;
};
 
export const askAI = async (req, res) => {
  try {
    const { prompt, noteTitle = "", noteContent = "" } = req.body ?? {};
 
    if (typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a prompt.",
      });
    }
 
    if (prompt.length > MAX_PROMPT_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Prompt must be under ${MAX_PROMPT_LENGTH} characters.`,
      });
    }
 
    const title = String(noteTitle).trim();
    const content = String(noteContent).trim().slice(0, MAX_NOTE_LENGTH);
 
    const contents = `
Current note title:
${title || "(none)"}
 
Current note content:
${content || "(empty)"}
 
User's question:
${prompt.trim()}
`.trim();
 
    const response = await generateWithFallback(contents);
 
    const answer = response.text?.trim();
    if (!answer) {
      return res.status(502).json({
        success: false,
        message: "The AI returned no answer. Please try again.",
      });
    }
 
    return res.status(200).json({ success: true, answer });
  } catch (error) {
    // Full details go to the server logs (Render -> Logs), not to the user
    console.error(
      "Gemini API Error:",
      error?.status,
      error?.message || error
    );
 
    if (isRetryable(error) || isModelUnavailable(error)) {
      return res.status(503).json({
        success: false,
        message: "The AI is busy right now. Please try again in a moment.",
      });
    }
 
    return res.status(500).json({
      success: false,
      message: "Something went wrong with the AI service. Please try again.",
    });
  }
};
 