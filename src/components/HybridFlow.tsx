import React, { useState } from "react";
import { ArrowRight, Key, ShieldCheck, Play, RefreshCw, Volume2, ShieldAlert } from "lucide-react";
import { Language } from "../types";
import { speakText } from "../utils/speech";

interface Props {
  language: Language;
  voiceEnabled: boolean;
  textSize: "normal" | "large";
}

export function HybridFlow({ language, voiceEnabled, textSize }: Props) {
  const [activeStep, setActiveStep] = useState(0);

  const stepsUz = [
    {
      title: "1. Ulanish so'rovi va Ochiq Kalit ulashish",
      desc: "IoT qurilmasi serverga ulanadi. Server o'zining asimmetrik OCHIQ kalitini (Public Key) qurilmaga taqdim etadi.",
      animationState: "sharing-public-key"
    },
    {
      title: "2. Qurilmada Simmetrik Seans Kalitini yaratish",
      desc: "Qurilma o'z ichida keyingi tezkor aloqa uchun bir martalik yashirin simmetrik seans kalitini (Session Key) tasodifiy hosil qiladi.",
      animationState: "generating-session-key"
    },
    {
      title: "3. Seans Kalitini shifrlab uzatish",
      desc: "IoT qurilmasi serverning ochiq kaliti bilan ushbu yashirin seans kalitini shifrlab serverga yuboradi. Tarmoqdagi uchinchi shaxs buni uqi olmaydi.",
      animationState: "transmitting-encrypted-key"
    },
    {
      title: "4. Serverda Simmetrik Kalitni ochish",
      desc: "Server o'zining maxfiy kaliti (Private Key) orqali shifr yopiq seans kalitini ochadi. Endi datchik ham, server ham bir xil kalitga ega bo'ldi.",
      animationState: "decrypting-key-at-server"
    },
    {
      title: "5. Ultra tezkor Simmetrik ma'lumot uzatish",
      desc: "Muqobil kalit xavfsiz o'rnatildi. Datchik o'zi o'qigan barcha ma'lumotlarni o'ta tejamkor AES shifrlash bilan to'xtovsiz serverga uzatadi.",
      animationState: "secure-symmetric-tunnel"
    }
  ];

  const stepsEn = [
    {
      title: "1. Connection Setup & Public Key Distribution",
      desc: "The IoT Node pings the server. In return, the server registers the node and broadcasts its Asymmetric Public Key (RSA/ECC) over the line.",
      animationState: "sharing-public-key"
    },
    {
      title: "2. Session Key Generation at the Device",
      desc: "The resource-constrained IoT node generates a ephemeral (one-time) Symmetric Session Key (AES) locally.",
      animationState: "generating-session-key"
    },
    {
      title: "3. Encrypting and Transmitting the Session Key",
      desc: "Using the server's public key, the device encrypts the Session Key. It transmits the cipher bytes over the air securely.",
      animationState: "transmitting-encrypted-key"
    },
    {
      title: "4. Private Decryption of the Session Key by Server",
      desc: "The IoT Server decrypts the payload using its matched Private Key. Now both nodes share the identical Symmetric Session Key.",
      animationState: "decrypting-key-at-server"
    },
    {
      title: "5. Safe High-Speed Symmetric Bulk Tunneling",
      desc: "The secure key handshake ends. Continuous sensor streams now flow under lightweight hardware-accelerated AES-128 stream blocks.",
      animationState: "secure-symmetric-tunnel"
    }
  ];

  const currentSteps = language === "uz" ? stepsUz : stepsEn;

  const triggerStepVoice = (idx: number) => {
    const step = currentSteps[idx];
    speakText(`${step.title}. ${step.desc}`, language);
  };

  const handleNextStep = () => {
    const nextIdx = (activeStep + 1) % currentSteps.length;
    setActiveStep(nextIdx);
    if (voiceEnabled) {
      triggerStepVoice(nextIdx);
    }
  };

  return (
    <div
      id="hybrid-pipeline-section"
      className="bg-slate-950 border border-slate-850 rounded-xs p-6 shadow-md flex flex-col gap-6 font-sans text-slate-100"
    >
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3
            className={`font-semibold tracking-tight text-white ${
              textSize === "large" ? "text-2xl" : "text-xl"
            }`}
          >
            {language === "uz" ? "Gibrid IoT Shifrlash Arxitekturasi" : "Hybrid IoT Cryptography Architecture"}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {language === "uz"
              ? "Zamonaviy aqlli qurilmalarda eng xavfsiz va tezkor deb tan olingan gibrid (aralash) model darsi."
              : "Learn the production industry standard combining Asymmetric Key exchange with Symmetric block ciphers."}
          </p>
        </div>

        <button
          onClick={() =>
            speakText(
              language === "uz"
                ? "Gibrid shifrlash - muloqotni boshlashda asimmetrik usulda xavfsiz kalit almashadi, so'ngra simmetrik usulda tezkor shifrlashga o'tadi."
                : "Hybrid encryption uses asymmetric cryptography to securely establish a secret key, then uses symmetric cryptography for high-speed continuous communication.",
              language
            )
          }
          className="flex items-center gap-2 px-3 py-1.5 rounded-xs border border-slate-800 text-xs font-mono font-bold tracking-widest text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 active:bg-slate-900 transition-all self-start cursor-pointer"
        >
          <Volume2 className="h-3.5 w-3.5 text-cyan-400" />
          <span>{language === "uz" ? "Mohiyatini Tinglash" : "Audio Architecture Overview"}</span>
        </button>
      </div>

      {/* Visual Workspace Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Step Guide List */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-1 font-bold">
            {language === "uz" ? "[01-STEPS] O'quv Bosqichlari:" : "[01-STEPS] Handshake Phase Steps:"}
          </span>

          <div className="flex flex-col gap-2">
            {currentSteps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveStep(idx);
                  if (voiceEnabled) triggerStepVoice(idx);
                }}
                className={`text-left p-3 rounded-xs border transition-all cursor-pointer relative flex gap-3 ${
                  activeStep === idx
                    ? "bg-slate-900 border-cyan-500 text-white shadow-md shadow-cyan-500/10"
                    : "bg-slate-950 border-slate-855 text-slate-400 hover:text-slate-200 hover:border-slate-800"
                }`}
              >
                {/* Visual Bullet count */}
                <div
                  className={`h-5 w-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                    activeStep === idx ? "bg-cyan-400 text-slate-955" : "bg-slate-900 text-slate-600"
                  }`}
                >
                  {idx + 1}
                </div>

                <div className="flex-1">
                  <h4 className="font-bold text-xs leading-tight mb-0.5 whitespace-normal">
                    {step.title}
                  </h4>
                  {activeStep === idx && (
                    <p className="text-[10.5px] text-slate-400 mt-1 leading-normal">
                      {step.desc}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleNextStep}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 text-slate-955 font-mono font-bold tracking-widest text-xs uppercase rounded-xs shadow-sm mt-2 cursor-pointer transition-all animate-pulse"
          >
            <span>{language === "uz" ? "Keyingi Qadam" : "Advance Handshake"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Dynamic Interactive Stage */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-855 rounded-xs p-4 flex flex-col justify-between relative overflow-hidden min-h-[300px]">
          {/* Status Overlay */}
          <div className="flex justify-between items-center text-[10px] font-mono tracking-widest uppercase text-slate-500 mb-4 bg-slate-900 p-2 rounded-xs border border-slate-850">
            <span>{language === "uz" ? "Hozirgi Bosqich:" : "Active Status:"}</span>
            <span className="text-cyan-400 font-bold">
              {language === "uz" ? `BOSQICH - ${activeStep + 1}` : `PHASE - 0${activeStep + 1}`}
            </span>
          </div>

          {/* Interactive Core Graphic */}
          <div className="my-auto flex flex-col gap-6 relative z-10 px-2 select-none">
            {/* Devices nodes */}
            <div className="flex items-center justify-between relative">
              {/* Device Node */}
              <div className="flex flex-col items-center gap-2 text-center w-24">
                <div className="h-14 w-14 rounded-sm flex items-center justify-center bg-slate-900 border border-slate-800 relative">
                  <span className="text-2xl">📟</span>

                  {/* Tiny Session Key generated inside Device icon during step 2 */}
                  {activeStep >= 1 && (
                    <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-cyan-400 text-slate-955 flex items-center justify-center shadow animate-bounce text-xs font-bold font-mono">
                      <Key className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-205">IoT Device</p>
                  <p className="text-[9px] font-mono text-slate-500 uppercase">Constrained</p>
                </div>
              </div>

              {/* Central Transmission Air Area */}
              <div className="flex-1 px-4 relative flex flex-col items-center justify-center">
                {/* Step animations packets moving */}
                {activeStep === 0 && (
                  <div className="flex flex-col items-center animate-pulse">
                    <span className="text-[9px] text-[#00ffcc] font-mono mb-1">Server Public Key RSA</span>
                    <div className="h-8 w-8 rounded-sm bg-cyan-955/40 text-cyan-400 flex items-center justify-center border border-cyan-500/20 animate-bounce">
                      🔑
                    </div>
                    <span className="text-[9px] text-slate-500 mt-1 font-mono">{"Server ➔ Device"}</span>
                  </div>
                )}

                {activeStep === 1 && (
                  <div className="flex flex-col items-center text-center">
                    <span className="text-[9px] text-cyan-400 font-mono mb-1">AES-128 Generating</span>
                    <div className="h-8 w-8 rounded-sm bg-slate-900 text-cyan-400 flex items-center justify-center border border-slate-800 animate-spin">
                      ⏳
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="flex flex-col items-center animate-pulse">
                    <span className="text-[9px] text-cyan-400 font-mono mb-1">Encrypted Session Key</span>
                    <div className="h-8 w-8 rounded-sm bg-cyan-955/40 text-cyan-400 flex items-center justify-center border border-cyan-500/20 animate-bounce">
                      📦
                    </div>
                    <span className="text-[9px] text-slate-500 mt-1 font-mono">{"Device ➔ Server"}</span>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] text-cyan-400 font-mono mb-1">Decryption Match</span>
                    <div className="h-8 w-8 rounded-sm bg-slate-900 text-cyan-400 flex items-center justify-center border border-slate-800 animate-pulse">
                      🧩
                    </div>
                    <span className="text-[9px] text-slate-500 mt-1 font-mono">Private key match</span>
                  </div>
                )}

                {activeStep === 4 && (
                  <div className="flex flex-col items-center text-center">
                    <span className="text-[10px] text-cyan-400 font-mono mb-0.5 font-bold flex items-center gap-1 uppercase tracking-wider">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#00ffcc]" /> Secure AES Link
                    </span>
                    <div className="w-full flex items-center gap-1 justify-center my-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-ping"></span>
                      <span className="h-0.5 bg-cyan-500 flex-1 rounded"></span>
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-ping"></span>
                    </div>
                    <span className="text-[9px] text-cyan-500/80 font-mono">{"Lightweight symmetric loop established"}</span>
                  </div>
                )}
              </div>

              {/* Server Gateway Node */}
              <div className="flex flex-col items-center gap-2 text-center w-24">
                <div className="h-14 w-14 rounded-sm flex items-center justify-center bg-slate-900 border border-slate-800 relative">
                  <span className="text-2xl">🖥️</span>

                  {/* Private Asymmetric key stored safely on Server */}
                  <div className="absolute -bottom-1 -left-1 h-5 w-5 rounded-xs bg-cyan-500 border border-cyan-400 text-slate-950 flex items-center justify-center shadow text-[10px] font-bold font-mono">
                    d
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-205">Server Node</p>
                  <p className="text-[9px] font-mono text-slate-500 uppercase">Powerful CPU</p>
                </div>
              </div>
            </div>
          </div>

          {/* Explanation console */}
          <div className="mt-4 p-3 rounded-xs border border-slate-855 bg-slate-900/40 flex flex-col gap-2">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono">
              {language === "uz" ? "Tizim Jurnali (Live Log Trace):" : "Simulation Output Console:"}
            </span>

            <p className="text-xs text-slate-300 font-sans leading-relaxed font-normal">
              {currentSteps[activeStep].desc}
            </p>

            <div className="flex items-center gap-2 border-t border-slate-855 pt-2 mt-1 font-mono text-[10px] text-slate-400 justify-between">
              <span>
                {activeStep === 4 ? (
                  <span className="text-cyan-400 font-bold flex items-center gap-1 animate-pulse">
                    ✔ AES-128-GCM IS ACTIVE
                  </span>
                ) : (
                  <span>⌛ STATUS: HANDSHAKING...</span>
                )}
              </span>

              <span>
                {language === "uz" ? "Xavfsizlik: Gibrid model" : "Security: High-grade hybrid schema"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
