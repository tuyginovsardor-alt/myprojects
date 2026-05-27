let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speakText(text: string, lang: "uz" | "en") {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    console.warn("Speech Synthesis is not supported in this environment.");
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Strip complex markdown or formatting before speaking
  const cleanText = text
    .replace(/[#*`_~]/g, "")
    .replace(/\[.*?\]\(.*?\)/g, "")
    .replace(/\{.*?\}/g, "");

  const utterance = new SpeechSynthesisUtterance(cleanText);
  
  // Try to find matching voice
  const voices = window.speechSynthesis.getVoices();
  if (lang === "uz") {
    // There is no standard default uzbek voice in most browsers, but we map it. 
    // Usually tr_TR (Turkish) provides a very closely understandable accent for the Uzbek language.
    // Let's look for Turkish, Russian or Uzbek voices first.
    const trVoice = voices.find((v) => v.lang.startsWith("tr") || v.lang.startsWith("uz"));
    if (trVoice) {
      utterance.voice = trVoice;
    }
    utterance.lang = "uz-UZ";
  } else {
    const enVoice = voices.find((v) => v.lang.startsWith("en") && v.name.includes("Google"));
    if (enVoice) {
      utterance.voice = enVoice;
    } else {
      const standardEn = voices.find((v) => v.lang.startsWith("en"));
      if (standardEn) utterance.voice = standardEn;
    }
    utterance.lang = "en-US";
  }

  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
