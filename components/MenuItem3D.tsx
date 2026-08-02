"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { type Dish, type Language, getLocalizedText } from "@/types/menu";
import { formatPrice } from "@/lib/format";
import { tagInfo } from "@/lib/tags";

interface MenuItem3DProps {
  dish: Dish;
  lang: Language;
  onOpen: (dish: Dish) => void;
}

/**
 * Card piatto con effetto "3D overlap": la PNG trasparente è posizionata
 * in assoluto e sporge fuori dalla card (sopra e a destra).
 */
export function MenuItem3D({ dish, lang, onOpen }: MenuItem3DProps) {
  const nome = getLocalizedText(dish.nome, lang);
  const descrizione = getLocalizedText(dish.descrizione, lang);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      className="mt-2 list-none"
    >
      <button
        type="button"
        onClick={() => onOpen(dish)}
        className="relative block w-full rounded-3xl border border-[#722F37]/15 bg-white/60 p-5 pr-[7.5rem] text-left shadow-[0_14px_34px_-20px_rgba(114,47,55,0.4)] backdrop-blur-md transition-colors hover:border-[#722F37]/35"
      >
        {/* Immagine sporgente — il cuore dell'effetto 3D */}
        <Image
          src={dish.image}
          alt={nome}
          width={224}
          height={224}
          className="pointer-events-none absolute -right-4 -top-4 h-28 w-28 rotate-6 object-contain drop-shadow-[0_14px_16px_rgba(70,35,25,0.35)]"
        />

        {dish.tags.length > 0 && (
          <div className="mb-1.5 flex flex-wrap gap-1.5">
            {dish.tags.map((id) => {
              const tag = tagInfo(id, lang);
              return (
                <span
                  key={id}
                  className={`shrink-0 whitespace-nowrap rounded-full border px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest ${tag.className}`}
                >
                  {tag.label}
                </span>
              );
            })}
          </div>
        )}

        <h3 className="font-serif text-xl font-bold leading-tight text-zinc-900">{nome}</h3>

        {descrizione && (
          <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-600">{descrizione}</p>
        )}

        <p className="mt-3 font-serif text-lg font-bold text-[#722F37]">
          {formatPrice(dish.prezzo)}
        </p>
      </button>
    </motion.li>
  );
}
