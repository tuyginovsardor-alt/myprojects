import React, { useState, useEffect } from "react";
import { Key, Play, ShieldAlert, ShieldCheck, Thermometer, Radio, Server, ThumbsUp, Volume2, Info } from "lucide-react";
import { DeviceType, IOT_DEVICES, Language } from "../types";
import { speakText } from "../utils/speech";

interface Props {
  selectedDevice: DeviceType;
  language: Language;
  voiceEnabled: boolean;
  textSize: "normal" | "large";
}

export function SymmetricSimulator({ selectedDevice, language, voiceEnabled, textSize }: Props) {
  const currentDevice = IOT_DEVICES.find((d) => d.id === selectedDevice) || IOT_DEVICES[0];

  const [cleartext, setCleartext] = useState(
    language === "uz" ? currentDevice.typicalPayloadUz : currentDevice.typicalPayloadEn
  );
  const [secretKey, setSecretKey] = useState("S3CR3T_K3Y_XOR");
  const [encryptionActive, setEncryptionActive] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // Auto-update cleartext payload when device or language changes
  useEffect(() => {
    setCleartext(language === "uz" ? currentDevice.typicalPayloadUz : currentDevice.typicalPayloadEn);
    setActiveStep(0);
  }, [selectedDevice, language, currentDevice]);

  // XOR Cipher implementation
  const runXorCipher = (text: string, keyCode: string): string => {
    let result = "";
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ keyCode.charCodeAt(i % keyCode.length);
      result += String.fromCharCode(charCode);
    }
    return result;
  };

  // Convert string to hex representation
  const toHex = (str: string): string => {
    return Array.from(str)
      .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0").toUpperCase())
      .join(" ");
  };

  const encryptedContent = runXorCipher(cleartext, secretKey);
  const encryptedHex = toHex(encryptedContent);
  const cleartextHex = toHex(cleartext);

  const stepsUz = [
    {
      title: "1. Ochiq ma'lumot (Cleartext)",
      desc: "Datchik o'lchagan xom ma'lumotlarni o'qiydi. U butunlay ochiq matn shaklida bo'ladi.",
      details: `Ma'lumot: "${cleartext}" (${cleartext.length} bayt)`
    },
    {
      title: "2. Bayt darajasiga o'tkazish (Hex)",
      desc: "Kompyuter ma'lumotni tushunishi uchun belgilarni uning 16-lik (Hex) kodlariga o'tkazamiz.",
      details: `Hex: ${cleartextHex.slice(0, 36)}...`
    },
    {
      title: "3. Simmetrik Kalit bilan XOR amali",
      desc: "Ma'lumotning har bir bayti yashirin kalit baytlari bilan bitma-bit XOR (Inkor) mantiqiy amalidan o'tkaziladi. Bu eng tezkor simmetrik tizim.",
      details: `Kalit: "${secretKey}" (${secretKey.length} bayt)`
    },
    {
      title: "4. Shifrlangan Ma'lumot (Ciphertext)",
      desc: "Shifrlash amali yakunlandi. Ma'lumot tushunarsiz va o'qib bo'lmas belgilarga aylandi.",
      details: `Shifrlangan Hex: ${encryptedHex.slice(0, 36)}...`
    }
  ];

  const stepsEn = [
    {
      title: "1. Cleartext Payload",
      desc: "The raw sensor data reading is captured in plain readable format.",
      details: `Data: "${cleartext}" (${cleartext.length} bytes)`
    },
    {
      title: "2. Byte Array Conversion (Hex)",
      desc: "To encrypt, we convert the physical string bytes into their hexadecimal forms.",
      details: `Hex representation: ${cleartextHex.slice(0, 36)}...`
    },
    {
      title: "3. Bitwise Symmetric XOR Operation",
      desc: "Every payload byte is logically combined with the secret key bytes via quick hardware-friendly XOR. This is ultra-fast for microcontrollers.",
      details: `Key: "${secretKey}" (${secretKey.length} bytes)`
    },
    {
      title: "4. Resulting Ciphertext",
      desc: "The cleartext collapses into secure, high-entropy cipher bytes readable only by key holders.",
      details: `Ciphertext Hex: ${encryptedHex.slice(0, 36)}...`
    }
  ];

  const currentSteps = language === "uz" ? stepsUz : stepsEn;

  const triggerVoiceReadStep = (index: number) => {
    const step = currentSteps[index];
    const textToSpeak = `${step.title}. ${step.desc}. ${step.details}`;
    speakText(textToSpeak, language);
  };

  const handleStartSimulation = () => {
    setIsSimulating(true);
    setActiveStep(0);
    if (voiceEnabled) {
      speakText(
        language === "uz"
          ? "Simmetrik shifrlash simulyatsiyasi boshlandi. Birinchi qadam: ochiq ma'lumot."
          : "Symmetric simulation started. Step one: Cleartext payload loaded.",
        language
      );
    }

    let interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= 3) {
          clearInterval(interval);
          setIsSimulating(false);
          if (voiceEnabled) {
            speakText(
              language === "uz"
                ? "Simulyatsiya tugadi. Shifrlangan ma'lumot tayyor."
                : "Symmetric encryption complete. Secure payload is ready for transmission.",
              language
            );
          }
          return 3;
        }
        const next = prev + 1;
        if (voiceEnabled) {
          triggerVoiceReadStep(next);
        }
        return next;
      });
    }, 3000);
  };

  return (
    <div
      id="symmetric-sim-section"
      className="bg-slate-900/40 border border-slate-850 p-6 rounded-md shadow-md flex flex-col gap-6"
    >
      {/* Block Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-mono text-cyan-500 tracking-widest block font-bold mb-1">
            {language === "uz" ? "[ 02 ] SIMMETRIK SHIFRLASH" : "[ 02 ] SYMMETRIC CIPHER"}
          </span>
          <h3
            className={`font-semibold tracking-wide text-cyan-400 font-display uppercase ${
              textSize === "large" ? "text-2xl" : "text-xl"
            }`}
          >
            {language === "uz" ? "Simmetrik Shifrlash Simulatori" : "Symmetric Cryptography Simulator"}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {language === "uz"
              ? "IoT datchik ma'lumotlarini tezkor va xavfsiz shifrlash jarayonini ko'ring."
              : "Watch real-time bitwise stream encryption for sensor transmission, optimized for microcontrollers."}
          </p>
        </div>

        {/* Listen Audio Button */}
        <button
          onClick={() =>
            speakText(
              language === "uz"
                ? "Simmetrik shifrlashda datchik va server bir xil maxfiy yashirin kalitdan foydalanadi. O'ta tezkor mantiqiy XOR amali orqali ishlaydi."
                : "Symmetric cryptography secures data using a pre-shared secret key. It is highly optimized for lightweight hardware.",
              language
            )
          }
          className="flex items-center gap-2 px-3 py-1.5 rounded-xs border border-slate-800 text-xs font-mono font-bold text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-all self-start"
          title={language === "uz" ? "Tushuntirishni eshitish" : "Listen to explanation"}
        >
          <Volume2 className="h-3.5 w-3.5 text-cyan-400" />
          <span>{language === "uz" ? "Ovozli Tushuntirish" : "Audio Guide"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Parameters Box */}
        <div className="lg:col-span-5 flex flex-col gap-4 bg-slate-950/60 p-5 rounded-md border border-slate-850">
          <div className="flex items-center gap-2 font-mono text-cyan-400 text-xs uppercase tracking-wider border-b border-slate-800 pb-2">
            <Info className="h-4 w-4 text-cyan-400 font-bold" />
            <span>{language === "uz" ? "Parametrlar" : "Simulation Inputs"}</span>
          </div>

          {/* Data Payload Input */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-mono uppercase text-slate-400">
              {language === "uz" ? "Datchik Payloadi (Harorat yoki buyruq):" : "Sensor Payload (Xcleartext):"}
            </label>
            <input
              type="text"
              value={cleartext}
              onChange={(e) => {
                setCleartext(e.target.value);
                setActiveStep(0);
              }}
              className="px-3 py-2 border rounded-xs bg-slate-900 border-slate-800 text-sm focus:outline-cyan-500 text-slate-100 font-mono"
            />
          </div>

          {/* Symmetric Shared Secret Key */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
              <Key className="h-3.5 w-3.5 text-cyan-450" />
              <span>{language === "uz" ? "Yashirin Simmetrik Kalit:" : "Shared Symmetric Key:"}</span>
            </label>
            <input
              type="text"
              value={secretKey}
              onChange={(e) => {
                setSecretKey(e.target.value || "KEY");
                setActiveStep(0);
              }}
              className="px-3 py-2 border rounded-xs bg-slate-900 border-slate-800 text-sm focus:outline-cyan-500 text-slate-100 font-mono"
            />
            <span className="text-[10px] text-slate-400 mt-1 italic">
              {language === "uz"
                ? "Datchik va Serverda ushbu kalit mos tushishi shart!"
                : "This key must reside identical on both IoT nodes."}
            </span>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-col gap-2 mt-2">
            <button
              onClick={handleStartSimulation}
              disabled={isSimulating}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 text-slate-950 font-mono font-bold tracking-widest text-xs uppercase rounded-xs shadow-sm disabled:opacity-50 transition-all cursor-pointer"
            >
              <Play className="h-4 w-4" />
              <span>
                {isSimulating
                  ? language === "uz"
                    ? "Ishlamoqda..."
                    : "Simulating..."
                  : language === "uz"
                  ? "Shifrlashni Boshlash"
                  : "Run Simulation"}
              </span>
            </button>

            {/* Toggle Encryption Protection */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-3 mt-1">
              <span className="text-[10px] font-mono uppercase text-slate-400">
                {language === "uz" ? "Shifrlash Himoyasi:" : "Encryption State:"}
              </span>
              <button
                onClick={() => {
                  setEncryptionActive(!encryptionActive);
                  if (voiceEnabled) {
                    speakText(
                      !encryptionActive
                        ? language === "uz"
                          ? "Muloqot shifrlash himoyasi yoqildi."
                          : "Encryption stream enabled."
                        : language === "uz"
                        ? "Muloqot shifrlash himoyasi o'chirildi! Xavf ostidasiz."
                        : "Encryption protection disabled! Payload transmitted in plaintext.",
                      language
                    );
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-semibold select-none border cursor-pointer transition-all ${
                  encryptionActive
                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/40"
                    : "bg-red-950/25 text-red-400 border-red-900/40"
                }`}
              >
                {encryptionActive ? <ShieldCheck className="h-3.5 w-3.5" /> : <ShieldAlert className="h-3.5 w-3.5" />}
                <span>{encryptionActive ? (language === "uz" ? "YOQILGAN" : "ENABLED") : (language === "uz" ? "O'CHIK (XAVFLI)" : "DISABLED (VULNERABLE)")}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Visual Simulated Pipeline Graph */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="border border-slate-800 rounded-md p-4 flex flex-col bg-slate-950/50 justify-between flex-1 relative overflow-hidden">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block mb-3">
              {language === "uz" ? "[01-TRACK] IoT Aloqa Yo'li (Tarmoq Yo'lagi)" : "[01-TRACK] Live Network Pipeline Map"}
            </span>

            {/* Nodes Row */}
            <div className="flex items-center justify-between gap-2 my-auto px-2 relative z-10">
              {/* Node 1: Sensor Device */}
              <div className="flex flex-col items-center gap-2">
                <div className="h-12 w-12 rounded-sm flex items-center justify-center shadow-md bg-slate-900 border border-slate-800 transition-all">
                  <Thermometer className="h-6 w-6 text-cyan-400 animate-pulse" />
                </div>
                <div className="text-center w-24">
                  <p className="text-[11px] font-bold text-slate-200 line-clamp-1">{currentDevice.nameUz.split(" ")[0]}</p>
                  <p className="text-[9px] font-mono text-slate-500 uppercase">Device</p>
                </div>
              </div>

              {/* Arrow Line with data packets */}
              <div className="flex-1 h-1 bg-slate-800 rounded-full relative overflow-hidden mx-1">
                <div
                  className={`absolute top-0 bottom-0 w-8 rounded-full blur-[1px] transition-all duration-1000 ${
                    encryptionActive ? "bg-cyan-500" : "bg-rose-500 animate-bounce"
                  }`}
                  style={{
                    animation: "scrollPulse-2 2.5s infinite linear",
                    animationName: "scrollPulse-2"
                  }}
                />
              </div>

              {/* Node 2: Middleware Gateway / Air Channel */}
              <div className="flex flex-col items-center gap-2">
                <div className="h-10 w-10 rounded-sm flex items-center justify-center bg-slate-900 border border-slate-800">
                  <Radio className="h-5 w-5 text-cyan-500 animate-ping" style={{ animationDuration: "3s" }} />
                </div>
                <div className="text-center">
                  <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Wi-Fi/Zigbee</p>
                </div>
              </div>

              {/* Arrow Line 2 */}
              <div className="flex-1 h-1 bg-slate-800 rounded-full relative overflow-hidden mx-1">
                <div
                  className={`absolute top-0 bottom-0 w-8 rounded-full blur-[1px] ${
                    encryptionActive ? "bg-cyan-500" : "bg-rose-500"
                  }`}
                  style={{
                    animation: "scrollPulse-2 2.5s infinite linear",
                    animationName: "scrollPulse-2",
                    animationDelay: "1.2s"
                  }}
                />
              </div>

              {/* Node 3: Server Gateway */}
              <div className="flex flex-col items-center gap-2">
                <div className="h-12 w-12 rounded-sm flex items-center justify-center shadow-md bg-slate-900 border border-slate-800">
                  <Server className="h-6 w-6 text-cyan-400" />
                </div>
                <div className="text-center w-24">
                  <p className="text-[11px] font-bold text-slate-200">IoT Server</p>
                  <p className="text-[9px] font-mono text-slate-500 uppercase font-light">Receiver</p>
                </div>
              </div>
            </div>

            {/* Hacker/Eavesdropper Intercept Graphic */}
            <div className="mt-4 border-t border-dashed border-slate-800 pt-3 flex flex-col bg-slate-900/20 rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-6 rounded-sm bg-rose-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                  💀
                </div>
                <div>
                  <h4 className="text-xs font-bold text-rose-400 flex items-center gap-2 uppercase font-mono tracking-wider">
                    <span>{language === "uz" ? "Xaker Snipping (Yo'ldagi Hujum):" : "Eavesdropper Wire-tap Node:"}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      Intercepting Live Stream
                    </span>
                  </h4>
                </div>
              </div>

              {/* What Hacker sees depending on encryption state */}
              <div className="p-2 rounded bg-slate-950 border border-slate-850 font-mono text-[11px] overflow-x-auto text-cyan-400 select-all min-h-12 flex flex-col justify-center">
                {encryptionActive ? (
                  <div className="text-cyan-400/90 leading-tight">
                    <p className="text-slate-500 text-[10px] italic mb-0.5">{"// Encripted Data Bytes (Unreadable Garbage):"}</p>
                    <p className="break-all tracking-widest text-[#00ffcc] font-bold text-xs">{encryptedHex}</p>
                  </div>
                ) : (
                  <div className="text-rose-455 leading-tight">
                    <p className="text-rose-400 text-[10px] italic mb-0.5 font-bold">{"⚠️ ERROR // Plaintext Leak intercepted!"}</p>
                    <p className="font-bold text-sm tracking-wide bg-rose-500/10 px-2 py-1 rounded inline-block text-rose-500">
                      {cleartext}
                    </p>
                    <p className="text-slate-550 text-[9px] mt-1">HEX: {cleartextHex}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Micro-style to make scrollPulse-2 keyframes work natively in Tailwind project */}
            <style>{`
              @keyframes scrollPulse-2 {
                0% { left: -20%; }
                100% { left: 120%; }
              }
            `}</style>
          </div>

          {/* Interactive Steps list */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-1 font-bold">
              {language === "uz" ? "[02-ENGINE] Bosqichma-bosqich XOR amali:" : "[02-ENGINE] Symmetric Phase Trace Engine:"}
            </span>

            {/* Loop Steps */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 font-sans">
              {currentSteps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveStep(idx);
                    triggerVoiceReadStep(idx);
                  }}
                  className={`text-left p-3 rounded-xs border transition-all cursor-pointer relative ${
                    activeStep === idx
                      ? "bg-slate-950 border-cyan-500 shadow-md shadow-cyan-500/10 text-white"
                      : "bg-slate-900/20 border-slate-850 hover:bg-slate-900/60 hover:border-slate-700 text-slate-350"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[10px] font-mono uppercase font-bold tracking-wider ${
                        activeStep === idx
                          ? "text-cyan-400"
                          : "text-slate-500"
                      }`}
                    >
                      {language === "uz" ? `Qadam ${idx + 1}` : `Step ${idx + 1}`}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerVoiceReadStep(idx);
                      }}
                      className="text-slate-500 hover:text-[#00ffcc] cursor-pointer"
                    >
                      <Volume2 className="h-3 w-3" />
                    </button>
                  </div>
                  <h5 className="font-semibold text-xs leading-tight mb-1 text-slate-200">
                    {step.title.split(". ")[1]}
                  </h5>
                  <p className="text-[10px] text-slate-400 line-clamp-2 leading-normal">{step.desc}</p>
                </button>
              ))}
            </div>

            {/* Selected Step Detailed View */}
            <div className="bg-slate-900/50 border border-slate-850 rounded-xs p-3 text-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
              <div className="flex-1">
                <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">
                  {language === "uz" ? "[03-TRACE] Tanlangan bosqich tafsiloti" : "[03-TRACE] Detailed Log Trace"}
                </span>
                <p className="text-xs font-bold text-slate-100 font-sans mt-0.5">
                  {currentSteps[activeStep].title}
                </p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {currentSteps[activeStep].desc}
                </p>
              </div>

              <div className="bg-slate-950 px-3 py-2 rounded-xs border border-slate-800 text-xs font-mono break-all text-cyan-400 max-w-full md:max-w-xs text-right shadow-inner">
                {currentSteps[activeStep].details}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
