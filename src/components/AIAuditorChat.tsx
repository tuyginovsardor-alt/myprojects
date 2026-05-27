import React, { useState } from "react";
import { ShieldCheck, ShieldAlert, Cpu, Send, RefreshCw, Volume2, HelpCircle, Server } from "lucide-react";
import { DeviceType, IOT_DEVICES, Language } from "../types";
import { speakText } from "../utils/speech";

interface Props {
  selectedDevice: DeviceType;
  language: Language;
  voiceEnabled: boolean;
  textSize: "normal" | "large";
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function AIAuditorChat({ selectedDevice, language, voiceEnabled, textSize }: Props) {
  const currentDevice = IOT_DEVICES.find((d) => d.id === selectedDevice) || IOT_DEVICES[0];

  // Audit Form setup states
  const [symAlgo, setSymAlgo] = useState("AES");
  const [symKeySize, setSymKeySize] = useState(128);
  const [asymAlgo, setAsymAlgo] = useState("ECC");
  const [asymKeySize, setAsymKeySize] = useState(256);

  // Results status
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<{
    score: number;
    analysis: string;
    recommendation: string;
    vulnerabilities: string[];
  } | null>(null);

  // Chat conversation
  const [userInput, setUserInput] = useState("");
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [isChatloading, setIsChatLoading] = useState(false);

  // Handle configuration safety Audit
  const handleRunAudit = async () => {
    setIsAuditing(true);
    setAuditResult(null);

    if (voiceEnabled) {
      speakText(
        language === "uz"
          ? "Sun'iy intellekt tahlil tizimi ishga tushirildi. Iltimos kalitlaringiz tekshirilmoqda..."
          : "Analyzing your IoT configuration via server-side Gemini intelligence...",
        language
      );
    }

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceType: currentDevice.nameEn,
          symmetricAlgo: symAlgo,
          asymmetricAlgo: asymAlgo,
          keySizeSym: symKeySize,
          keySizeAsym: asymKeySize,
          language: language
        })
      });

      const data = await response.json();
      setAuditResult(data);

      if (voiceEnabled && data.analysis) {
        // Read out score and analysis summary
        const scoreTextUz = `Tekshiruv reytingi: 100 balldan ${data.score} ball. Tahlil: ${data.analysis}`;
        const scoreTextEn = `Security score is ${data.score} out of 100. Analysis: ${data.analysis}`;
        speakText(language === "uz" ? scoreTextUz : scoreTextEn, language);
      }
    } catch (error) {
      console.error("Audit failure:", error);
    } finally {
      setIsAuditing(false);
    }
  };

  // Handle Chat submit
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newMsg: ChatMessage = { role: "user", content: userInput };
    const updatedHistory = [...conversation, newMsg];
    setConversation(updatedHistory);
    setUserInput("");
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: newMsg.content,
          history: conversation,
          language: language
        })
      });

      const data = await response.json();
      const replyMsg: ChatMessage = { role: "assistant", content: data.reply || "Error occurred" };
      setConversation((prev) => [...prev, replyMsg]);

      if (voiceEnabled && replyMsg.content) {
        speakText(replyMsg.content, language);
      }
    } catch (e: any) {
      console.error("Chat failure:", e);
    } finally {
      setIsChatLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-250";
    if (score >= 60) return "text-amber-500 bg-amber-50 dark:bg-amber-950/20 border-amber-250";
    return "text-red-500 bg-red-50 dark:bg-red-950/20 border-red-250";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans text-slate-100">
      {/* Configuration Auditor form panel */}
      <div className="lg:col-span-5 bg-slate-950 border border-slate-850 rounded-xs p-5 shadow-md flex flex-col gap-5">
        <div className="border-b border-slate-850 pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-1.5 uppercase tracking-wider font-mono">
            <Cpu className="h-4 w-4 text-cyan-400" />
            <span>{language === "uz" ? "Konfiguratsiya Tekshiruvi" : "Configuration Audit Guard"}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {language === "uz"
              ? "Tanlangan qurilma turi uchun kalitlaringiz xavfsizligini hisoblang."
              : "Verify cryptology parameters against energy overhead constraints."}
          </p>
        </div>

        {/* Selected target IoT node */}
        <div className="bg-slate-900 p-3 rounded-xs border border-slate-800 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-455 font-semibold">{language === "uz" ? "Tekshiriluvchi qurilma:" : "Target Node:"}</span>
          <span className="font-bold text-cyan-300 bg-slate-950 px-2 py-1 rounded shadow-inner border border-slate-850">
            {language === "uz" ? currentDevice.nameUz : currentDevice.nameEn}
          </span>
        </div>

        {/* Symmetric settings */}
        <div className="flex flex-col gap-3 rounded-xs border border-slate-850 p-3 bg-slate-1000/20">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1 font-mono">
            1. {language === "uz" ? "Simmetrik blok sozlamasi" : "Symmetric Block cipher"}
          </span>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-bold text-slate-455">{language === "uz" ? "Algoritm:" : "Algorithm:"}</label>
              <select
                value={symAlgo}
                onChange={(e) => setSymAlgo(e.target.value)}
                className="px-2 py-1.5 border rounded-xs bg-slate-900 border-slate-800 text-xs text-slate-200 cursor-pointer focus:outline-none focus:border-cyan-500"
              >
                <option value="AES">AES (Advanced Std)</option>
                <option value="ChaCha20">ChaCha20 (Stream)</option>
                <option value="XOR">XOR (Vernam Simple)</option>
                <option value="DES">DES (Deprecated!)</option>
              </select>
            </div>

            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-bold text-slate-455">{language === "uz" ? "Kalit Hajmi:" : "Key Size (bits):"}</label>
              <select
                value={symKeySize}
                onChange={(e) => setSymKeySize(parseInt(e.target.value))}
                className="px-2 py-1.5 border rounded-xs bg-slate-900 border-slate-800 text-xs text-slate-200 cursor-pointer focus:outline-none focus:border-cyan-500"
              >
                <option value="64">64 bits ({language === "uz" ? "Murdor" : "Low"})</option>
                <option value="128">128 bits ({language === "uz" ? "O'rtacha" : "Standard"})</option>
                <option value="256">256 bits ({language === "uz" ? "Kuchli" : "Military"})</option>
              </select>
            </div>
          </div>
        </div>

        {/* Asymmetric settings */}
        <div className="flex flex-col gap-3 rounded-xs border border-slate-850 p-3 bg-slate-1000/20">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1 font-mono">
            2. {language === "uz" ? "Asimmetrik shifrlash sozlamasi" : "Asymmetric key swap"}
          </span>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-bold text-slate-455">{language === "uz" ? "Algoritm:" : "Algorithm:"}</label>
              <select
                value={asymAlgo}
                onChange={(e) => setAsymAlgo(e.target.value)}
                className="px-2 py-1.5 border rounded-xs bg-slate-900 border-slate-800 text-xs text-slate-200 cursor-pointer focus:outline-none focus:border-cyan-500"
              >
                <option value="ECC">ECC (Elliptic Curve)</option>
                <option value="RSA">RSA (Modular Primes)</option>
                <option value="Diffie-Hellman">Diffie-Hellman</option>
              </select>
            </div>

            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-bold text-slate-455">{language === "uz" ? "Kalit Hajmi:" : "Key Size (bits):"}</label>
              <select
                value={asymKeySize}
                onChange={(e) => setAsymKeySize(parseInt(e.target.value))}
                className="px-2 py-1.5 border rounded-xs bg-slate-900 border-slate-800 text-xs text-slate-200 cursor-pointer focus:outline-none focus:border-cyan-500"
              >
                <option value="128">128 bits</option>
                <option value="256">256 bits</option>
                <option value="1024">1024 bits</option>
                <option value="2048">2048 bits</option>
                <option value="3072">3072 bits</option>
              </select>
            </div>
          </div>
        </div>

        {/* Audit trigger Button */}
        <button
          onClick={handleRunAudit}
          disabled={isAuditing}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-40 text-slate-950 font-mono font-bold uppercase tracking-wider text-xs rounded-xs shadow-sm cursor-pointer transition-all"
        >
          {isAuditing ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <ShieldCheck className="h-4 w-4" />
          )}
          <span>{isAuditing ? (language === "uz" ? "Hisoblanmoqda..." : "Evaluating...") : (language === "uz" ? "Konfiguratsiyani Tekshirish" : "Run Intelligent Audit")}</span>
        </button>

        {/* Audit dynamic response display */}
        {auditResult && (
          <div className="border border-slate-850 rounded-xs p-4 bg-slate-950 text-slate-200 flex flex-col gap-3 font-sans">
            <div className="flex items-center justify-between border-b border-slate-850 pb-2">
              <span className="text-[10px] font-mono font-bold text-slate-455 uppercase tracking-wider">{language === "uz" ? "Xavfsizlik Indeksi:" : "Security Index:"}</span>
              <span className={`text-xs font-bold font-mono px-3 py-1 bg-slate-900 rounded border border-cyan-500/30 text-cyan-400 leading-none`}>
                {auditResult.score} / 100
              </span>
            </div>

            <div className="text-xs leading-relaxed text-slate-350">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-[10px] text-slate-500 tracking-wider font-mono inline-block">ANALYSIS REPORT</span>
                <button
                  onClick={() => speakText(auditResult.analysis, language)}
                  className="text-slate-500 hover:text-[#00ffcc] shrink-0 cursor-pointer"
                  title={language === "uz" ? "Tahlilni o'qib berish" : "Read report aloud"}
                >
                  <Volume2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="indent-2 select-all leading-relaxed">{auditResult.analysis}</p>
            </div>

            {/* recommendation line */}
            <div className="border-t border-slate-850 pt-2 text-[11px]">
              <span className="font-mono font-bold text-slate-500 block mb-0.5 uppercase tracking-wider">{language === "uz" ? "TAVSIYA:" : "RECOMMENDATION:"}</span>
              <span className="text-[#00ffcc] font-mono font-bold leading-normal bg-slate-900 border border-slate-850 px-2.5 py-1 rounded inline-block mt-0.5">
                {auditResult.recommendation}
              </span>
            </div>

            {/* List vulnerabilities */}
            {auditResult.vulnerabilities && auditResult.vulnerabilities.length > 0 && (
              <div className="border-t border-slate-850 pt-2 text-[10px]">
                <span className="font-mono font-bold text-rose-400 uppercase tracking-widest block mb-1">
                  ⛔ {language === "uz" ? "Zaiflik omillari:" : "Identified Vulnerabilities:"}
                </span>
                <ul className="list-disc list-inside text-rose-355/80 pl-1.5 flex flex-col gap-1 leading-normal">
                  {auditResult.vulnerabilities.map((v, i) => (
                    <li key={i}>{v}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cyber assistant Interactive chatbot workspace */}
      <div className="lg:col-span-7 bg-slate-950 border border-slate-855 rounded-xs shadow-md flex flex-col justify-between overflow-hidden min-h-[480px]">
        {/* Chat top header banner */}
        <div className="bg-slate-900 p-4 border-b border-slate-850 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-sm bg-slate-950 border border-slate-800 text-indigo-400 flex items-center justify-center text-sm font-bold">
              🤖
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-205 uppercase tracking-wider leading-none font-mono">
                {language === "uz" ? "AI Kripto Maslahatchi" : "AI Cyber Security Advisor"}
              </h4>
              <span className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-1 font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                <span>SYS_LLM_CONNECTED ➔ flash3.5</span>
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setConversation([]);
              speakText(
                language === "uz" ? "Suhbat jurnali tozalandi." : "Chat conversation reset complete.",
                language
              );
            }}
            className="text-[9px] font-mono font-bold text-slate-400 hover:text-cyan-400 tracking-wider uppercase bg-slate-950 border border-slate-800 px-2 py-1 rounded-sm cursor-pointer"
          >
            {language === "uz" ? "Tozalash" : "Reset"}
          </button>
        </div>

        {/* Chat Message Lists history container */}
        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 min-h-[300px] max-h-[360px]">
          {conversation.length === 0 && (
            <div className="my-auto text-center flex flex-col items-center justify-center p-6 gap-3">
              <HelpCircle className="h-8 w-8 text-cyan-400 animate-bounce" />
              <p className="text-xs text-slate-455 max-w-sm leading-relaxed">
                {language === "uz"
                  ? "Assalomu alaykum! Men shifrlash modellari, datchiklarda cheklangan CPU / batareya sarfi yoki loyiha himoyasiga oid har qanday savolingizga javob beraman. Savol yozing."
                  : "Welcome! Ask me any professional query about symmetric vs asymmetric, RSA keys, ECDSA signatures, or hardware-acceleration on IoT microchips."}
              </p>
            </div>
          )}

          {conversation.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col max-w-[85%] rounded-xs px-3.5 py-2.5 text-xs ${
                msg.role === "user"
                  ? "bg-slate-900 self-end border border-slate-800 text-slate-205 md:max-w-[75%]"
                  : "bg-slate-900 border border-cyan-505/20 self-start text-[#00ffcc] md:max-w-[75%]"
              }`}
            >
              <div className="flex items-center justify-between gap-3 border-b border-slate-850 pb-1 mb-1.5 font-bold font-mono text-[9px] uppercase tracking-wider text-slate-500">
                <span>{msg.role === "user" ? (language === "uz" ? "Siz" : "User") : (language === "uz" ? "Maslahatchi" : "AI Advisor")}</span>
                
                {/* Speaker play option on the card directly */}
                {msg.role === "assistant" && (
                  <button
                    onClick={() => speakText(msg.content, language)}
                    className="text-slate-550 hover:text-[#00ffcc] cursor-pointer"
                    title={language === "uz" ? "Javobni eshitish" : "Speak response"}
                  >
                    <Volume2 className="h-3 w-3" />
                  </button>
                )}
              </div>
              <p className="whitespace-pre-line leading-relaxed select-all font-sans text-slate-350">{msg.content}</p>
            </div>
          ))}

          {isChatloading && (
            <div className="self-start bg-slate-900 p-2 text-[10px] rounded-sm border border-slate-850 animate-pulse text-slate-550 font-mono">
              {language === "uz" ? "Fikrlar o'ylab chiqilmoqda..." : "AI Cryptographer is typing..."}
            </div>
          )}
        </div>

        {/* Input prompt tray form */}
        <form
          onSubmit={handleChatSubmit}
          className="p-3 border-t border-slate-850 bg-slate-900 flex gap-2"
        >
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={isChatloading}
            placeholder={
              language === "uz"
                ? "Savolingiz (Masalan: IoTda nega asimmetrik shifrlash sekin?)..."
                : "Ask cryptography question (e.g., Why is ECC preferred over RSA for microcontrollers?)..."
            }
            className="flex-1 px-3 py-2 border rounded-xs bg-slate-950 border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
          />

          <button
            type="submit"
            disabled={isChatloading || !userInput.trim()}
            className="p-2 rounded-xs bg-cyan-500 hover:bg-cyan-600 disabled:opacity-40 text-slate-955 shrink-0 cursor-pointer shadow-sm transition-all text-xs"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
