import type { Language } from "@/types/menu";

/** Definizione centralizzata dei tag: etichetta localizzata + classi Tailwind. */
export const TAGS: Record<string, { label: Record<Language, string>; className: string }> = {
  veg: {
    label: { it: "Veg", en: "Veg" },
    className: "border-[#5E7F3E]/40 bg-[#5E7F3E]/10 text-[#4E6B3C]",
  },
  novita: {
    label: { it: "Novità", en: "New" },
    className: "border-[#722F37] bg-[#722F37] text-[#FDFBF7]",
  },
  best: {
    label: { it: "Best Seller", en: "Best Seller" },
    className: "border-[#A67B2E]/45 bg-[#A67B2E]/10 text-[#8A6420]",
  },
  share: {
    label: { it: "Da condividere", en: "To share" },
    className: "border-[#722F37]/35 bg-[#722F37]/5 text-[#722F37]",
  },
  classico: {
    label: { it: "Classico", en: "Classic" },
    className: "border-[#722F37]/35 bg-[#722F37]/5 text-[#722F37]",
  },
};

export function tagInfo(id: string, lang: Language) {
  const tag = TAGS[id];
  if (!tag) return { label: id, className: "border-[#722F37]/35 text-[#722F37]" };
  return { label: tag.label[lang] ?? tag.label.it, className: tag.className };
}
