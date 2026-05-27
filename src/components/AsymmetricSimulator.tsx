import React, { useState } from "react";
import { KeyRound, RefreshCw, Cpu, Volume2, ShieldCheck, Zap } from "lucide-react";
import { Language } from "../types";
import { speakText } from "../utils/speech";

interface Props {
  language: Language;
  voiceEnabled: boolean;
  textSize: "normal" | "large";
}

export function AsymmetricSimulator({ language, voiceEnabled, textSize }: Props) {
  // Real modular math implementation of small RSA
  // Choosing primes p=11, q=13 -> Euler Totient phi=120
  const p = 11;
  const q = 13;
  const n = p * q; // 143
  const phi = (p - 1) * (q - 1); // 120
  const e = 7; // Coprime to 120
  const d = 103; // modular inverse of 7 mod phi (7 * 103 = 721 -> 721 % 120 = 1)

  const [sessionKey, setSessionKey] = useState(42); // Message to encrypt, must be < n (143)
  const [activeStep, setActiveStep] = useState(0);

  // Modular exponentiation utility helper
  const powerMod = (base: number, exp: number, mod: number): number => {
    let res = 1;
    base = base % mod;
    let tempExp = exp;
    while (tempExp > 0) {
      if (tempExp % 2 === 1) {
        res = (res * base) % mod;
      }
      tempExp = Math.floor(tempExp / 2);
      base = (base * base) % mod;
    }
    return res;
  };

  const encryptedValue = powerMod(sessionKey, e, n);
  const decryptedValue = powerMod(encryptedValue, d, n);

  const stepsUz = [
    {
      title: "1. Ikki tub sonni tanlash (p va q)",
      desc: "Asimmetrik RSA asosi: Bir-biriga yaqin bo'lmagan ikkita katta tub son olinadi.",
      math: `p = ${p}, q = ${q} (Tub sonlar)`
    },
    {
      title: "2. Modul hisoblash (n va φ)",
      desc: "Keyin modul n hisoblanadi. n tarmoqda hammaga e'lon qilinadi. φ(n) esa yashirin qoladi.",
      math: `n = ${p} × ${q} = ${n}. φ(n) = 10 × 12 = 120`
    },
    {
      title: "3. Kalit juftliklarini yaratish",
      desc: "Ochiq kalit (e) ixtiyoriy tanlanadi. Maxfiy yashirin kalit (d) esa matematik hisoblanadi.",
      math: `Ochiq (e) = ${e}. Maxfiy (d) = ${d}`
    },
    {
      title: "4. Ochiq kalit bilan shifrlash",
      desc: "IoT qurilmasi serverning ochiq kaliti panelidan foydalanib xabar yoki simmetrik kalitni shifrlaydi.",
      math: `C = M^e mod n ➔ ${sessionKey}^${e} mod ${n} = ${encryptedValue}`
    },
    {
      title: "5. Maxfiy kalit bilan ochish (Server)",
      desc: "Faqat Server o'zining yopiq maxfiy kaliti (d) orqali xabarni qayta tiklay oladi.",
      math: `M = C^d mod n ➔ ${encryptedValue}^${d} mod ${n} = ${decryptedValue}`
    }
  ];

  const stepsEn = [
    {
      title: "1. Selection of Primes (p & q)",
      desc: "Prime number multiplication lies at the core of asymmetric safety. We pick distinct primes.",
      math: `p = ${p}, q = ${q} (Primes)`
    },
    {
      title: "2. Computing RSA Modulus",
      desc: "Modulus 'n' is shared publicly with all IoT endpoints, while Totient φ remains strictly private.",
      math: `n = p × q = ${n}. φ(n) = 120`
    },
    {
      title: "3. Generating Key Pairs (e & d)",
      desc: "The public exponent 'e' is established, and the secret decryption exponent 'd' is calculated mathematically.",
      math: `Public: e = ${e}. Private: d = ${d}`
    },
    {
      title: "4. Asymmetric Public Encryption",
      desc: "The resource-constrained IoT node encrypts its temporary session key using the server's public key.",
      math: `C = M^e mod n ➔ ${sessionKey}^${e} mod ${n} = ${encryptedValue}`
    },
    {
      title: "5. Private Server Decryption",
      desc: "Only the server holding the matched secret key 'd' can isolate and decrypt the session key.",
      math: `M = C^d mod n ➔ ${encryptedValue}^${d} mod ${n} = ${decryptedValue}`
    }
  ];

  const currentSteps = language === "uz" ? stepsUz : stepsEn;

  const triggerVoiceExplanation = () => {
    const textUz = `Asimmetrik shifrlashda ikkita har xil kalit qo'llaniladi. Bittasi ochiq kalit shifrlash uchun. Ikkinchisi maxfiy kalit deshifrlash uchun. Ushbu simulyator RSA formulasining haqiqiy matematik hisob-kitobini ko'rsatmoqda. p teng ${p}, q teng ${q}, Modul n teng ${n} ga. Sinab ko'rish uchun maxfiy sonni o'zgartiring.`;
    const textEn = `Asymmetric algorithms utilize distinct public and private key pairs. In this mathematical simulator, we demonstrate the actual RSA math. We compile with primes p and q, making modulus ${n}. Enter a custom session key number on the left to see modular calculations.`;
    speakText(language === "uz" ? textUz : textEn, language);
  };

  const speakStep = (idx: number) => {
    const step = currentSteps[idx];
    speakText(`${step.title}. ${step.desc}. Formula: ${step.math}`, language);
  };

  return (
    <div
      id="asymmetric-sim-section"
      className="bg-slate-950 border border-slate-850 rounded-xs p-6 shadow-md flex flex-col gap-6 font-sans"
    >
      {/* Header section with voice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3
            className={`font-semibold tracking-tight text-white ${
              textSize === "large" ? "text-2xl" : "text-xl"
            }`}
          >
            {language === "uz" ? "Asimmetrik Shifrlash (RSA) Simulatori" : "Asymmetric Cryptography (RSA) Simulator"}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {language === "uz"
              ? "Matematik ochiq/maxfiy modul formulasiga tayanuvchi shifrlash mexanizmi."
              : "Explore the prime factoring mathematics behind public key infrastructure systems."}
          </p>
        </div>

        <button
          onClick={triggerVoiceExplanation}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xs border border-slate-800 text-xs font-mono font-bold tracking-widest text-slate-350 hover:text-cyan-400 hover:border-cyan-500/40 active:bg-slate-900 transition-all self-start cursor-pointer"
        >
          <Volume2 className="h-3.5 w-3.5 text-cyan-400" />
          <span>{language === "uz" ? "Konsepsiyani Tinglash" : "Listen to Math Guide"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input parameters panel */}
        <div className="lg:col-span-5 flex flex-col gap-4 bg-slate-950 p-4 rounded-xs border border-slate-850">
          <div className="flex items-center gap-2 font-medium text-slate-200 text-xs border-b border-slate-850 pb-2 uppercase tracking-wider font-mono">
            <Cpu className="h-4 w-4 text-cyan-400" />
            <span>{language === "uz" ? "Matematik Kirish" : "Prime Mathematics Setup"}</span>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-900/60 border border-slate-800/80 p-2.5 rounded-sm leading-relaxed">
            {language === "uz"
              ? "Ushbu kichik RSA matematik modelida p=11 va q=13 tub sonlari tahlil qilindi. Bu modul darajasi n=143 ga teng."
              : "This simulation uses standard primes p=11 and q=13, yielding an RSA modulus n=143. Values above this modulus rotate."}
          </div>

          {/* Slider for Numeric Session Key */}
          <div className="flex flex-col gap-1.5 mt-1">
            <label className="text-xs font-semibold text-slate-300 flex justify-between">
              <span>{language === "uz" ? "Yuboriladigan Kalit Qiymati (M):" : "Symmetric Key to Encrypt (M):"}</span>
              <span className="font-mono text-cyan-400 font-bold">{sessionKey}</span>
            </label>
            <input
              type="range"
              min="2"
              max="140"
              value={sessionKey}
              onChange={(e) => {
                setSessionKey(parseInt(e.target.value));
                if (voiceEnabled) {
                  speakText(
                    language === "uz"
                      ? `Kalit qiymati ${e.target.value} deb belgilandi.`
                      : `Selected session value is ${e.target.value}`,
                    language
                  );
                }
              }}
              className="w-full accent-cyan-500 cursor-pointer h-1 bg-slate-800 rounded-sm appearance-none"
            />
            <div className="flex justify-between text-[10px] text-slate-550 font-mono mt-1">
              <span>M = 2</span>
              <span>Modulus max (140)</span>
            </div>
          </div>

          {/* Active Generated Key Pairs information */}
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-850 mt-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-0.5 font-bold">
              {language === "uz" ? "Hosil bo'lgan Kalitlar:" : "Calculated RSA Key Pairs:"}
            </span>

            {/* Public Key Display */}
            <div className="flex items-center justify-between p-2 rounded-xs bg-cyan-950/10 border border-cyan-500/20">
              <span className="text-xs text-cyan-400 font-semibold">{language === "uz" ? "Ochiq Kalit (Server):" : "Public Encryption Key:"}</span>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-cyan-900 text-cyan-400 border border-cyan-505/30">
                (e={e}, n={n})
              </span>
            </div>

            {/* Private Key Display */}
            <div className="flex items-center justify-between p-2 rounded-xs bg-rose-950/10 border border-rose-500/20 animate-pulse">
              <span className="text-xs text-rose-455 font-semibold">{language === "uz" ? "Maxfiy Kalit (Yashirin):" : "Private Decryption Key:"}</span>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-rose-900 text-rose-400 border border-rose-505/30">
                (d={d}, n={n})
              </span>
            </div>
          </div>
        </div>

        {/* Modular Formulas Steps Trace Block */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-1 font-bold">
            {language === "uz" ? "[01-ENGINE] Bosqichma-bosqich hisob-kitoblar:" : "[01-ENGINE] RSA Formula Step Trace:"}
          </span>

          <div className="flex flex-col gap-2 flex-1">
            {currentSteps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveStep(idx);
                  speakStep(idx);
                }}
                className={`text-left p-2.5 rounded-xs border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  activeStep === idx
                    ? "bg-slate-950 border-cyan-500 shadow-sm shadow-cyan-500/10"
                    : "bg-slate-900/10 border-slate-850 hover:bg-slate-900/40 hover:border-slate-800"
                }`}
              >
                <div className="flex-1">
                  <span
                    className={`text-[9px] font-mono uppercase font-bold tracking-wider ${
                      activeStep === idx ? "text-cyan-400" : "text-slate-500"
                    }`}
                  >
                    {language === "uz" ? `0${idx + 1}-bosqich` : `Phase 0${idx + 1}`}
                  </span>
                  <h4 className="font-bold text-xs text-slate-205 leading-tight">
                    {step.title}
                  </h4>
                  <p className="text-[10.5px] mt-0.5 text-slate-400 leading-normal">
                    {step.desc}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 select-all font-mono text-[11px] font-bold bg-slate-950 rounded text-[#00ffcc] border border-slate-850">
                    {step.math}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speakStep(idx);
                    }}
                    className="text-slate-500 hover:text-cyan-400 cursor-pointer"
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </button>
            ))}
          </div>

          {/* Summary Box */}
          <div className="p-3 bg-slate-950 border border-slate-850 rounded-xs flex items-center justify-between text-slate-500 font-mono text-xs gap-4 overflow-x-auto">
            <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5 shrink-0">
              <Zap className="h-3 w-3 text-amber-500 animate-bounce" />
              <span>{language === "uz" ? "XULOSA:" : "OUTCOME:"}</span>
            </span>

            <div className="flex items-center gap-4 text-[11px] leading-none whitespace-nowrap text-slate-455">
              <div>
                M: <strong className="text-slate-200 text-xs">{sessionKey}</strong>
              </div>
              <div className="text-slate-800">•</div>
              <div className="text-cyan-400">
                C: <strong className="text-cyan-300 text-xs">{encryptedValue}</strong>
              </div>
              <div className="text-slate-800">•</div>
              <div className="text-[#00ffcc] font-bold">
                Mdec: <strong className="text-emerald-400 text-xs font-bold">{decryptedValue}</strong>
              </div>
            </div>

            <div className="flex items-center gap-1 select-none font-sans whitespace-nowrap shrink-0">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-[9px] font-bold text-emerald-500 tracking-wider">SECURE MATCH</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
