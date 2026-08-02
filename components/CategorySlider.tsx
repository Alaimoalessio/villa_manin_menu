"use client";

import { motion } from "framer-motion";
import { Beer, Cake, Coffee, Martini, Utensils, CupSoda, type LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  utensils: Utensils,
  martini: Martini,
  coffee: Coffee,
  beer: Beer,
  cake: Cake,
  soda: CupSoda,
};

export interface CategorySliderItem {
  id: string;
  name: string;
  icon: string;
}

interface CategorySliderProps {
  categories: CategorySliderItem[];
  activeId: string;
  onSelect: (id: string) => void;
}

/**
 * Navigazione categorie a icone con scroll orizzontale (scrollbar nascosta).
 * Il blocco solido Bordeaux della categoria attiva scivola tra i bottoni
 * grazie a `layoutId` di Framer Motion.
 */
export function CategorySlider({ categories, activeId, onSelect }: CategorySliderProps) {
  return (
    <nav aria-label="Categorie del menu" className="flex gap-2.5 overflow-x-auto px-5 pb-1 pt-3 scrollbar-hide">
      {categories.map((cat) => {
        const Icon = ICONS[cat.icon] ?? Utensils;
        const isActive = cat.id === activeId;
        return (
          <motion.button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            whileTap={{ scale: 0.94 }}
            aria-pressed={isActive}
            className="relative flex min-w-[78px] shrink-0 flex-col items-center gap-1.5 rounded-2xl px-3 pb-2.5 pt-3.5"
          >
            {isActive ? (
              <motion.span
                layoutId="category-pill"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                className="absolute inset-0 rounded-2xl bg-[#722F37] shadow-lg shadow-[#722F37]/30"
                aria-hidden
              />
            ) : (
              <span className="absolute inset-0 rounded-2xl border border-[#722F37]/15 bg-white/70" aria-hidden />
            )}
            <Icon
              strokeWidth={1.8}
              className={`relative z-10 h-[22px] w-[22px] transition-colors duration-200 ${isActive ? "text-[#FDFBF7]" : "text-[#722F37]"}`}
            />
            <span
              className={`relative z-10 whitespace-nowrap text-[11px] font-bold uppercase tracking-wide transition-colors duration-200 ${isActive ? "text-[#FDFBF7]" : "text-zinc-600"}`}
            >
              {cat.name}
            </span>
          </motion.button>
        );
      })}
    </nav>
  );
}
