import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

// Load environment variables
dotenv.config();

// Initialize the GoogleGenAI client (will lazily fail if key is missing when queried)
let ai: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("[Warning] GEMINI_API_KEY is not defined. AI Advisor features will fall back to local rule-based analysis.");
      return null;
    }
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return ai;
}

const app = express();
const PORT = 3000;

app.use(express.json());

// API: Security Audit of selected IoT use case + cryptographic algorithm combo
app.post("/api/audit", async (req, res) => {
  const { deviceType, symmetricAlgo, asymmetricAlgo, keySizeSym, keySizeAsym, language } = req.body;

  const isUzbek = language === "uz";
  
  const client = getGeminiClient();

  if (!client) {
    // Fallback if API key is missing
    const score = symmetricAlgo === "AES" && keySizeSym >= 128 && asymmetricAlgo === "ECC" ? 95 : 60;
    const fallbackText = isUzbek
      ? `[Lokal tahlil (API kaliti yo'q)] Tanlangan konfiguratsiya yuklandi. 
      Qurilma: ${deviceType}. 
      Simmetrik shifrlash: ${symmetricAlgo} (Kalit: ${keySizeSym} bit). 
      Asimmetrik shifrlash: ${asymmetricAlgo} (Kalit: ${keySizeAsym} bit). 
      Simmetrik shifrlash tezligi yuqori, ammo xavfsizlik darajasi tanlangan kalit hajmiga bog'liq. 
      Tavsiya: Kamida AES-128 va ECC-256 dan foydalaning.`
      : `[Local Fallback (Missing API Key)] The selected configuration has been analyzed locally. 
      Device: ${deviceType}. 
      Symmetric: ${symmetricAlgo} (${keySizeSym} bit). 
      Asymmetric: ${asymmetricAlgo} (${keySizeAsym} bit). 
      Symmetric is fast, but security depends on key sizing. 
      Recommendation: Combine at least AES-128 with ECC-256 for secure IoT deployment.`;

    return res.json({
      score,
      analysis: fallbackText,
      recommendation: isUzbek ? "AES-128 va ECC-256 shifrlash protokoli" : "AES-128 and ECC-256 hybrid setup",
      vulnerabilities: isUzbek 
        ? ["Sobiq algoritmlardagi zaifliklar", "Key sharing key distribution constraints"]
        : ["Key leakage over insecure exchange channels", "Brute-force risk on short key lengths"]
    });
  }

  try {
    const prompt = `You are a Senior Cyber Security & Cryptography Architect specializing in IoT Devices. 
    Analyze the following IoT device cryptographic configuration and provide a professional assessment in ${isUzbek ? "Uzbek (O'zbek tili)" : "English"}.

    IoT Device Type: ${deviceType}
    Symmetric Crypto: ${symmetricAlgo} (with key size: ${keySizeSym} bits)
    Asymmetric Crypto: ${asymmetricAlgo} (with key size: ${keySizeAsym} bits)

    Respond strictly in JSON format with the following keys (without any markdown formatting wrappers):
    {
      "score": <number from 0 to 100 assessing the safety of this hybrid setup>,
      "analysis": "<detailed paragraph evaluating the configuration, performance overhead on resource-constrained IoT, and security guarantees>",
      "recommendation": "<clear actionable target configuration recommendation>",
      "vulnerabilities": ["<vulnerability 1>", "<vulnerability 2>", ...]
    }`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Gemini Audit Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// API: Cyber Assistant General Chat
app.post("/api/chat", async (req, res) => {
  const { message, history, language } = req.body;
  const isUzbek = language === "uz";
  
  const client = getGeminiClient();

  if (!client) {
    return res.json({
      reply: isUzbek 
        ? "Assalomu alaykum! Men sizning IoT shifrlash bo'yicha sun'iy intellekt yordamchingizman. Loyihani to'liq ishlatish uchun Gemini API kalitini kiriting."
        : "Hello! I am your visual IoT cybersecurity assistant. To unlock the full power of Gemini reasoning, please configure your GEMINI_API_KEY in the Secrets panel."
    });
  }

  try {
    const systemInstruction = isUzbek 
      ? `Siz IoT (Internet of Things) tizimlarining kiber-xavfsizligi va simmetrik/asimmetrik shifrlash bo'yicha mutaxassissiz.
      Siz foydalanuvchiga simmetrik shifrlash (AES, DES, Vernam kabi) va asimmetrik shifrlash (RSA, ECC, Diffie-Hellman) farqlari, qo'llanilishi va IoT qurilmalarining cheklangan resurslari (CPU/batareya) bo'yicha batafsil, tushunarli va mutaxassischa javob berasiz. 
      Siz qisqa va aniq, o'ta ilmiy bo'lmagan, tushunarli tilda javob berasiz, chunki tinglovchilar orasida ko'zi ojiz yoki past ko'radigan talabalar ham bor. Matningiz ovozli eshittirishga mos, ravon bo'lishi lozim.`
      : `You are an expert in IoT (Internet of Things) Cybersecurity, Embedded Systems, and Symmetric/Asymmetric Cryptography.
      Explain clearly the concepts of symmetric (AES, Vernam/XOR) and asymmetric (RSA, ECC) encryption, key exchange protocols, speed vs security tradeoffs, and battery/CPU constraints on microcontrollers. 
      Keep answers clear and audio-friendly, suitable for text-to-speech rendering, since some users might be visually impaired. Ensure the tone is warm, professional, and academic.`;

    const contents = [];
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        contents.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }]
        });
      }
    }
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Serve frontend assets (Vite middleware in dev, static files in production)
async function startApp() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[IoT Crypto Simulator] Server is running on port ${PORT}`);
  });
}

startApp().catch((err) => {
  console.error("Failed to start full-stack server:", err);
});
