import { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Cpu, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  FileText, 
  Key, 
  TrendingUp, 
  Settings, 
  Layers, 
  HelpCircle,
  Thermometer, 
  Lock, 
  HeartPulse, 
  Video,
  Eye,
  Type
} from "lucide-react";
import { Language, ContrastMode, TextSize, DeviceType, IOT_DEVICES } from "./types";
import { speakText, stopSpeaking } from "./utils/speech";

import { SymmetricSimulator } from "./components/SymmetricSimulator";
import { AsymmetricSimulator } from "./components/AsymmetricSimulator";
import { HybridFlow } from "./components/HybridFlow";
import { AIAuditorChat } from "./components/AIAuditorChat";
import { GlossaryView } from "./components/GlossaryView";

export default function App() {
  // Locale & Accessibility states
  const [language, setLanguage] = useState<Language>("uz");
  const [contrastMode, setContrastMode] = useState<ContrastMode>("normal");
  const [textSize, setTextSize] = useState<TextSize>("normal");
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);

  // Application simulator states
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>("temp-sensor");
  const [activeTab, setActiveTab] = useState<"symmetric" | "asymmetric" | "hybrid" | "auditor" | "glossary">("symmetric");

  // Simple welcome speech announcement
  useEffect(() => {
    if (voiceEnabled) {
      const welcomeUz = "IoT Shifrlash va Kiber-Xavfsizlik Simulyatoriga xush kelibsiz! Ushbu platforma orqali siz simmetrik va asimmetrik shifrlash tushunchalarini o'rganishingiz mumkin.";
      const welcomeEn = "Welcome to the IoT Cryptography and Cyber Security Simulator! Learn and play with symmetric, asymmetric, and hybrid cryptography schemas.";
      speakText(language === "uz" ? welcomeUz : welcomeEn, language);
    }
  }, [language]);

  const toggleVoice = () => {
    if (voiceEnabled) {
      stopSpeaking();
      setVoiceEnabled(false);
    } else {
      setVoiceEnabled(true);
    }
  };

  const getLanguageLabel = (uz: string, en: string) => {
    return language === "uz" ? uz : en;
  };

  const activeDeviceDetails = IOT_DEVICES.find(d => d.id === selectedDevice) || IOT_DEVICES[0];

  return (
    <div 
      className={`min-h-screen transition-all ${
        contrastMode === "high" 
          ? "bg-black text-white" 
          : "bg-slate-950 text-slate-100"
      }`}
    >
      {/* Dynamic Header */}
      <header className={`border-b ${contrastMode === "high" ? "border-white" : "border-slate-850"} py-4 sticky top-0 bg-slate-950/90 backdrop-blur-md z-45`}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-sm bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/10">
              <ShieldCheck className="h-6 w-6 text-slate-950" />
            </div>
            <div>
              <h1 className="text-md font-extrabold uppercase tracking-wider font-display text-white">
                {getLanguageLabel("IoT Shifrlash & Kiber-Xavfsizlik", "IoT Cryptography & Cyber Security Simulyatori")}
              </h1>
              <span className="text-[10px] font-mono tracking-widest text-cyan-400 block uppercase font-bold">
                {getLanguageLabel("Ta'lim Simulyatori", "Interactive Science Playground")}
              </span>
            </div>
          </div>

          {/* Settings Tray - Designed for screen readers & High Contrast accessibility */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === "uz" ? "en" : "uz")}
              className={`px-3 py-1.5 rounded-xs text-xs font-mono font-bold tracking-wider cursor-pointer border ${
                contrastMode === "high" 
                  ? "border-white hover:bg-white hover:text-black" 
                  : "border-slate-800 hover:border-slate-705 text-slate-300 bg-slate-900"
              }`}
              title={getLanguageLabel("Tilni o'zgartirish", "Switch Language")}
            >
              🌐 {language === "uz" ? "ENGLISH" : "O'ZBEKCHA"}
            </button>

            {/* Accessibility: Contrast Toggle */}
            <button
              onClick={() => {
                const mode = contrastMode === "normal" ? "high" : "normal";
                setContrastMode(mode);
                if (voiceEnabled) {
                  speakText(
                    mode === "high" 
                      ? "Yuqori kontrast rejimi yoqildi." 
                      : "Oddiy ko'rinish rejimi yoqildi.", 
                    language
                  );
                }
              }}
              className={`px-3 py-1.5 rounded-xs text-xs font-mono font-bold tracking-wider cursor-pointer border ${
                contrastMode === "high" 
                  ? "border-yellow-400 text-yellow-400 bg-slate-950" 
                  : "border-slate-800 hover:border-slate-705 text-slate-300 bg-slate-900"
              }`}
              title={getLanguageLabel("Kontrastni almashtirish", "Accessibility Contrast Mode")}
            >
              👁️ {contrastMode === "high" ? "CONTRAST: HIGH" : "CONTRAST: NORMAL"}
            </button>

            {/* accessibility: text size */}
            <button
              onClick={() => {
                const size = textSize === "normal" ? "large" : "normal";
                setTextSize(size);
                if (voiceEnabled) {
                  speakText(
                    size === "large" 
                      ? "Yiriklashtirilgan matn rejimi yoqildi." 
                      : "O'rtacha matn rejimi yoqildi.", 
                    language
                  );
                }
              }}
              className={`px-3 py-1.5 rounded-xs text-xs font-mono font-bold tracking-wider cursor-pointer border ${
                contrastMode === "high" 
                  ? "border-white" 
                  : "border-slate-800 hover:border-slate-705 text-slate-300 bg-slate-900"
              }`}
              title={getLanguageLabel("Matn o'lchami", "Toggle Text Size")}
            >
              <span className="flex items-center gap-1.5">
                <Type className="h-3.5 w-3.5 text-cyan-400" />
                <span className="uppercase">{textSize === "large" ? "TEXT: LARGE" : "TEXT: NORMAL"}</span>
              </span>
            </button>

            {/* Speech synthesis on/off toggle */}
            <button
              onClick={toggleVoice}
              className={`px-3 py-1.5 rounded-xs text-xs font-mono font-bold tracking-wider cursor-pointer border transition-all ${
                voiceEnabled 
                  ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-400" 
                  : "border-slate-800 text-slate-400 bg-slate-900"
              }`}
              title={getLanguageLabel("Ovozli eshittirish", "Voice Output")}
            >
              {voiceEnabled ? (
                <span className="flex items-center gap-1">
                  <Volume2 className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                  <span>VOICE ON</span>
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <VolumeX className="h-3.5 w-3.5" />
                  <span>VOICE OFF</span>
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">
        
        {/* Top Feature: Interactive Device Selector Sandbox Area */}
        <section 
          id="device-sandbox-picker" 
          className={`p-6 border rounded-xs transition-all ${
            contrastMode === "high" 
              ? "border-white bg-black" 
              : "bg-gradient-to-br from-slate-950 to-slate-900 border-slate-850"
          }`}
        >
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 block font-bold mb-1">
                {getLanguageLabel("[ CHOOSE PHYSICAL ENVIRONMENT ]", "[ CHOOSE PHYSICAL ENVIRONMENT ]")}
              </span>
              <h2 className="text-lg font-bold text-white uppercase tracking-wide">
                {getLanguageLabel("1. Shifrlanuvchi Qurilmani Tanlang", "1. Choose IoT Device Context")}
              </h2>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                {getLanguageLabel(
                  "Har bir aqlli datchik o'ziga xos hisoblash tezligi, batareya quvvati va hayotiy jiddiylik darajasiga ega. Tanlang va shifrlash algoritmlari ustida sinab ko'ring.",
                  "Microchips differ by payload sizing, battery limitations, and overall life safety. Toggle device and test your algorithms."
                )}
              </p>
            </div>

            {/* Interactive Picker Pills Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {IOT_DEVICES.map(device => {
                const isSelected = selectedDevice === device.id;
                return (
                  <button
                    key={device.id}
                    onClick={() => {
                      setSelectedDevice(device.id);
                      if (voiceEnabled) {
                        speakText(
                          language === "uz" 
                            ? `${device.nameUz} tanlandi.` 
                            : `${device.nameEn} environmental configuration loaded.`, 
                          language
                        );
                      }
                    }}
                    className={`p-3 border rounded-xs select-none transition-all text-left flex flex-col justify-between h-24 cursor-pointer hover:scale-[1.02] ${
                      isSelected 
                        ? contrastMode === "high"
                          ? "border-white bg-white text-black"
                          : "border-cyan-500 ring-1 ring-cyan-500/20 bg-cyan-950/20"
                        : contrastMode === "high"
                          ? "border-zinc-800 text-white"
                          : "border-slate-850 text-slate-400 hover:border-slate-700 bg-slate-950"
                    }`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <span className="text-xl">
                        {device.id === "temp-sensor" && "🌡️"}
                        {device.id === "smart-lock" && "🔒"}
                        {device.id === "pacemaker" && "🫀"}
                        {device.id === "security-camera" && "📹"}
                      </span>
                      {isSelected && (
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      )}
                    </div>

                    <div className="mt-2">
                      <h4 className="font-bold text-[11px] leading-tight truncate uppercase font-display">
                        {language === "uz" ? device.nameUz : device.nameEn}
                      </h4>
                      <p className="text-[9px] font-mono opacity-60 tracking-wider">
                        {device.id.toUpperCase()}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Stats Panel for Selected Node */}
          <div className="mt-4 border-t border-dashed border-slate-850 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-950/60 rounded border border-slate-855">
              <span className="font-mono text-[9px] text-slate-500 font-bold uppercase tracking-widest block mb-0.5">
                {getLanguageLabel("Tavsif (Description)", "Description")}
              </span>
              <p className="text-slate-350 leading-relaxed text-[11px]">
                {language === "uz" ? activeDeviceDetails.descriptionUz : activeDeviceDetails.descriptionEn}
              </p>
            </div>

            <div className="p-3 bg-slate-950/60 rounded border border-slate-855">
              <span className="font-mono text-[9px] text-slate-500 font-bold uppercase tracking-widest block mb-0.5">
                {getLanguageLabel("Xom Paylod Ma'lumoti", "Typical Plaintext Payload")}
              </span>
              <p className="text-cyan-400 font-mono text-[11px] font-bold">
                {language === "uz" ? activeDeviceDetails.typicalPayloadUz : activeDeviceDetails.typicalPayloadEn}
              </p>
            </div>

            <div className="p-3 bg-slate-950/60 rounded border border-slate-855">
              <span className="font-mono text-[9px] text-rose-455 font-bold uppercase tracking-widest block mb-0.5">
                ⚠️ {getLanguageLabel("Resurs / Energiya cheklovi", "Energy / Power limitations")}
              </span>
              <p className="text-slate-350 text-[11px] leading-relaxed">
                {language === "uz" ? activeDeviceDetails.powerLimitUz : activeDeviceDetails.powerLimitEn}
              </p>
            </div>
          </div>
        </section>

        {/* Navigation Tabs bar */}
        <section id="algorithm-navigator-tabs">
          <div className="flex border-b border-slate-855 overflow-x-auto gap-1 no-scrollbar select-none">
            {([
              { id: "symmetric", labelUz: "01. Simmetrik (XOR/AES)", labelEn: "01. Symmetric Cipher" },
              { id: "asymmetric", labelUz: "02. Asimmetrik (RSA)", labelEn: "02. Asymmetric Math" },
              { id: "hybrid", labelUz: "03. Gibrid Model", labelEn: "03. Hybrid Architecture" },
              { id: "auditor", labelUz: "04. AI Tahlilchi", labelEn: "04. AI Security Guard" },
              { id: "glossary", labelUz: "05. Kriptogafiya Lug'ati", labelEn: "05. Glossary Dictionary" }
            ] as const).map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (voiceEnabled) {
                      speakText(
                        language === "uz" 
                          ? `${tab.labelUz} bo'limiga o'tildi` 
                          : `Switched to ${tab.labelEn} view`, 
                        language
                      );
                    }
                  }}
                  className={`px-4 py-3 text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                    isActive
                      ? contrastMode === "high"
                        ? "border-white bg-white text-black"
                        : "border-cyan-500 text-cyan-400 bg-slate-900/40"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {language === "uz" ? tab.labelUz : tab.labelEn}
                </button>
              );
            })}
          </div>
        </section>

        {/* Dynamic Inner views container */}
        <section id="workbench-view-anchor" className="flex flex-col gap-6">
          {activeTab === "symmetric" && (
            <SymmetricSimulator 
              selectedDevice={selectedDevice} 
              language={language} 
              voiceEnabled={voiceEnabled} 
              textSize={textSize}
            />
          )}

          {activeTab === "asymmetric" && (
            <AsymmetricSimulator 
              language={language} 
              voiceEnabled={voiceEnabled} 
              textSize={textSize}
            />
          )}

          {activeTab === "hybrid" && (
            <HybridFlow 
              language={language} 
              voiceEnabled={voiceEnabled} 
              textSize={textSize}
            />
          )}

          {activeTab === "auditor" && (
            <AIAuditorChat 
              selectedDevice={selectedDevice} 
              language={language} 
              voiceEnabled={voiceEnabled} 
              textSize={textSize}
            />
          )}

          {activeTab === "glossary" && (
            <GlossaryView 
              language={language} 
              textSize={textSize}
            />
          )}
        </section>
      </main>

      {/* Aesthetic Footer Area */}
      <footer className="border-t border-slate-855 mt-16 py-8 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>
            {getLanguageLabel(
              "© 2026 Kiber Ta'lim Platformasi • Barcha talabalar (shu jumladan ko'zi ojizlar) uchin maxsus tushunarli.",
              "© 2016 Cyber Academy Workspace • Audio instruction tailored specifically for visual and accessibility inclusion."
            )}
          </p>
          <div className="flex gap-4">
            <span className="text-cyan-500">SYS_LIVE_MODE</span>
            <span>v1.2.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
