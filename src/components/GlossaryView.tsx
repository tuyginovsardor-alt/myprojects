import React, { useState } from "react";
import { Search, Volume2, BookOpen, Tag } from "lucide-react";
import { GLOSSARY, Language } from "../types";
import { speakText } from "../utils/speech";

interface Props {
  language: Language;
  textSize: "normal" | "large";
}

export function GlossaryView({ language, textSize }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | "Symmetric" | "Asymmetric" | "IoT" | "General">("All");

  const filteredGlossary = GLOSSARY.filter((item) => {
    const matchesSearch =
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definitionUz.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definitionEn.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleSpeakItem = (item: typeof GLOSSARY[0]) => {
    const termUz = `${item.term}. Ta'rifi: ${item.definitionUz}`;
    const termEn = `${item.term}. Definition: ${item.definitionEn}`;
    speakText(language === "uz" ? termUz : termEn, language);
  };

  return (
    <div
      id="glossary-section"
      className="bg-slate-950 border border-slate-850 rounded-xs p-6 shadow-md flex flex-col gap-6 font-sans text-slate-100"
    >
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3
            className={`font-semibold tracking-tight text-white flex items-center gap-2 ${
              textSize === "large" ? "text-2xl" : "text-xl"
            }`}
          >
            <BookOpen className="h-5 w-5 text-cyan-400" />
            <span>{language === "uz" ? "IoT Kiber-Xavfsizlik Lug'ati" : "IoT Cryptographic Glossary"}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {language === "uz"
              ? "Loyiha himoyasida qo'llaniladigan asosiy kriptografik atamalar lug'ati."
              : "Quick reference guide for core cryptographic concepts and terms."}
          </p>
        </div>

        {/* Global speak helper */}
        <button
          onClick={() =>
            speakText(
              language === "uz"
                ? "Lug'at bo'limi. Atamalarni qidirishingiz va har biri bo'yicha ovozli yo'riqnomani tinglashingiz mumkin."
                : "Glossary section. You can search terms and click the speaker icon to hear definitions read aloud.",
              language
            )
          }
          className="flex items-center gap-2 px-3 py-1.5 rounded-xs border border-slate-800 text-xs font-mono font-bold tracking-widest text-slate-350 hover:text-cyan-400 hover:border-cyan-500/40 active:bg-slate-900 transition-all self-start cursor-pointer"
        >
          <Volume2 className="h-3.5 w-3.5 text-cyan-400" />
          <span>{language === "uz" ? "Ovoz berish" : "Read Section"}</span>
        </button>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col md:flex-row gap-3 items-center">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder={language === "uz" ? "Atama qidirish..." : "Search security glossary..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border rounded-xs bg-slate-950 border-slate-800 text-xs focus:outline-none focus:border-cyan-500 text-slate-200 font-sans"
          />
        </div>

        {/* Categories Tab pills */}
        <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto self-start no-scrollbar">
          {(["All", "Symmetric", "Asymmetric", "IoT", "General"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xs text-[10px] font-bold font-mono uppercase tracking-wider whitespace-nowrap cursor-pointer transition-all border ${
                selectedCategory === cat
                  ? "bg-cyan-500 border-cyan-500 text-slate-950"
                  : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-800"
              }`}
            >
              {cat === "All" && (language === "uz" ? "Barchasi" : "All")}
              {cat === "Symmetric" && (language === "uz" ? "Simmetrik" : "Symmetric")}
              {cat === "Asymmetric" && (language === "uz" ? "Asimmetrik" : "Asymmetric")}
              {cat === "IoT" && "IoT"}
              {cat === "General" && (language === "uz" ? "Umumiy" : "General")}
            </button>
          ))}
        </div>
      </div>

      {/* Glossary cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGlossary.map((item, index) => (
          <div
            key={index}
            className="group flex flex-col justify-between border border-slate-855 hover:border-cyan-500/30 rounded-xs p-4 bg-slate-900/10 hover:bg-slate-900/20 transition-all duration-300 relative"
          >
            <div>
              <div className="flex items-center justify-between gap-2 border-b border-slate-850 pb-2 mb-2.5">
                <span className="font-bold text-xs uppercase tracking-wide text-cyan-400 font-mono">
                  {item.term}
                </span>

                {/* Speaker icon for screen reader experience */}
                <button
                  onClick={() => handleSpeakItem(item)}
                  className="p-1 rounded-sm bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-cyan-400 cursor-pointer transition-all shrink-0 border border-slate-800"
                  title={language === "uz" ? "Atamani ovozli eshitish" : "Hear audio description"}
                >
                  <Volume2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <p className="text-[11.5px] leading-relaxed text-slate-400">
                {language === "uz" ? item.definitionUz : item.definitionEn}
              </p>
            </div>

            <div className="flex items-center gap-1 mt-4 text-[9px] font-bold font-mono text-slate-500 uppercase tracking-widest bg-slate-900 border border-slate-850 px-2.5 py-0.5 rounded-sm self-start">
              <Tag className="h-2.5 w-2.5" />
              <span>{item.category}</span>
            </div>
          </div>
        ))}

        {filteredGlossary.length === 0 && (
          <div className="col-span-full py-8 text-center border border-dashed border-slate-800 rounded-xs">
            <p className="text-slate-550 text-xs font-mono uppercase">
              {language === "uz" ? "Tegishli atama topilmadi." : "No glossary items match your filters."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
