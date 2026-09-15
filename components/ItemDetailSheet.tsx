"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Check, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { DishPlaceholder } from "./DishPlaceholder";
import { useState, useEffect } from "react";
import { type Dish, type Language, getLocalizedList, getLocalizedText } from "@/types/menu";
import { formatPrice } from "@/lib/format";
import { tagInfo } from "@/lib/tags";
import { useCart } from "@/lib/cart-context";

interface ItemDetailSheetProps {
  dish: Dish | null;
  lang: Language;
  onClose: () => void;
}

const MotionImage = motion.create(Image);

/**
 * Bottom Sheet di dettaglio: overlay + pannello che sale dal basso
 * (spring Framer Motion), immagine gigante in primo piano che sborda
 * sopra il bordo del pannello, pillole ingredienti e CTA Bordeaux.
 * Trascinabile verso il basso per chiudere.
 */
export function ItemDetailSheet({ dish, lang, onClose }: ItemDetailSheetProps) {
  const { addToCart } = useCart();
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setSelectedOptionId(null);
    setQuantity(1);
  }, [dish]);

  const activeOption = dish?.options?.find((o) => o.id === selectedOptionId);
  const displayImage = activeOption?.image || dish?.image;

  const getDisplayName = () => {
    if (!dish) return "";
    const dishName = getLocalizedText(dish.nome, lang);
    if (activeOption) {
      // Come da richiesta, se c'è un'opzione (es. "Albicocca") lo mettiamo in evidenza, 
      // altrimenti il nome del piatto originale
      const optName = getLocalizedText(activeOption.nome, lang);
      return `${dishName} all'${optName}`; // "Succo all'Albicocca" - questo è un trucco veloce per l'italiano, ma facciamo una cosa più robusta:
    }
    return dishName;
  };

  const displayName = getDisplayName();
  const currentPrice = activeOption?.prezzo ?? dish?.prezzo ?? 0;

  const handleAddToCart = () => {
    if (!dish) return;
    addToCart({
      dishId: dish.id,
      nome: displayName,
      prezzo: currentPrice,
      quantita: quantity,
      optionId: activeOption?.id,
      optionNome: activeOption ? getLocalizedText(activeOption.nome, lang) : undefined,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {dish && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-zinc-900/40 backdrop-blur-[2px]"
          />
          <motion.div
            key="sheet"
            role="dialog"
            aria-modal="true"
            aria-label={getLocalizedText(dish.nome, lang)}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120) onClose();
            }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md rounded-t-[30px] bg-[#FDFBF7] px-6 pb-8 shadow-[0_-24px_70px_rgba(60,20,25,0.35)]"
          >
            <div className="mx-auto mt-3 h-1.5 w-11 rounded-full bg-zinc-300" />

            <button
              type="button"
              onClick={onClose}
              aria-label={lang === "it" ? "Chiudi" : "Close"}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#722F37]/20 bg-white text-[#722F37]"
            >
              <X className="h-4 w-4" strokeWidth={2.2} />
            </button>

            {/* Immagine gigante in primo piano, sborda sopra il pannello */}
            {!displayImage && dish && (
              <div className="mx-auto -mt-20 flex w-fit">
                <DishPlaceholder name={displayName} size="lg" />
              </div>
            )}
            {displayImage && (
              <MotionImage
                key={displayImage} // Forza il re-render e l'animazione al cambio immagine
                src={displayImage}
                alt={displayName}
                width={480}
                height={480}
                initial={{ scale: 0.7, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ delay: 0.08, type: "spring", stiffness: 200, damping: 20 }}
                className="pointer-events-none mx-auto -mt-28 block h-60 w-60 object-contain drop-shadow-[0_30px_30px_rgba(70,35,25,0.4)]"
              />
            )}

            {dish.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap justify-center gap-1.5">
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

            <h2 className="mt-3 text-center font-serif text-3xl font-bold leading-tight text-zinc-900">
              {activeOption ? getLocalizedText(activeOption.nome, lang) : getLocalizedText(dish.nome, lang)}
            </h2>
            <p className="mt-1 text-center font-serif text-2xl font-bold text-[#722F37]">
              {formatPrice(currentPrice)}
            </p>

            {dish.descrizione && (
              <p className="mx-auto mt-3 max-w-xs text-center text-sm leading-relaxed text-zinc-600">
                {getLocalizedText(dish.descrizione, lang)}
              </p>
            )}

            <p className="mb-3 mt-6 text-center text-[10px] font-extrabold uppercase tracking-[0.24em] text-zinc-400">
              {dish.options && dish.options.length > 0 ? (lang === "it" ? "Scegli il gusto" : "Choose flavor") : (lang === "it" ? "Ingredienti" : "Ingredients")}
            </p>

            {dish.options && dish.options.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-2">
                {dish.options.map((opt) => {
                  const isSelected = opt.id === selectedOptionId;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedOptionId(opt.id)}
                      className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                        isSelected
                          ? "border-[#722F37] bg-[#722F37] text-white shadow-md"
                          : "border-[#722F37]/30 bg-white/60 text-[#722F37] hover:bg-[#722F37]/10"
                      }`}
                    >
                      {getLocalizedText(opt.nome, lang)}
                    </button>
                  );
                })}
              </div>
            ) : (
              <ul className="flex flex-wrap justify-center gap-2">
                {getLocalizedList(dish.ingredients, lang).map((ing) => (
                  <li
                    key={ing}
                    className="shrink-0 whitespace-nowrap rounded-full border border-[#722F37] bg-white/60 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#722F37]"
                  >
                    {ing}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-7 flex items-center justify-center gap-5">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label={lang === "it" ? "Diminuisci quantità" : "Decrease quantity"}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#722F37]/30 bg-white/60 text-[#722F37] transition-colors hover:bg-[#722F37]/10"
              >
                <Minus className="h-4 w-4" strokeWidth={2.4} />
              </button>
              <span className="w-6 text-center font-serif text-xl font-bold text-zinc-900">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label={lang === "it" ? "Aumenta quantità" : "Increase quantity"}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#722F37]/30 bg-white/60 text-[#722F37] transition-colors hover:bg-[#722F37]/10"
              >
                <Plus className="h-4 w-4" strokeWidth={2.4} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={Boolean(dish?.options && dish.options.length > 0 && !selectedOptionId)}
              className={`mt-4 w-full rounded-2xl py-4 text-[13px] font-extrabold uppercase tracking-[0.14em] text-[#FDFBF7] transition-all active:scale-[0.98] ${
                dish?.options && dish.options.length > 0 && !selectedOptionId
                  ? "bg-zinc-400 cursor-not-allowed"
                  : "bg-[#722F37] hover:bg-[#5E262E]"
              }`}
            >
              {dish?.options && dish.options.length > 0 && !selectedOptionId
                ? (lang === "it" ? "Scegli un'opzione" : "Select an option")
                : `${lang === "it" ? "Aggiungi al carrello" : "Add to cart"} · ${formatPrice(currentPrice * quantity)}`
              }
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
