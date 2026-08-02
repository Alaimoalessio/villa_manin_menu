"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Trash2, X, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import type { Language } from "@/types/menu";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart-context";

interface CartSheetProps {
  open: boolean;
  lang: Language;
  onClose: () => void;
}

/**
 * Bottom sheet del carrello: stesso pattern di ItemDetailSheet (overlay +
 * pannello draggable). Ha due viste interne:
 * - "cart": riepilogo modificabile (quantità, rimozione)
 * - "summary": riepilogo finale pulito, pensato per essere mostrato allo staff
 */
export function CartSheet({ open, lang, onClose }: CartSheetProps) {
  const { items, totalPrice, updateQuantity, removeFromCart } = useCart();
  const [view, setView] = useState<"cart" | "summary">("cart");

  useEffect(() => {
    if (!open) setView("cart");
  }, [open]);

  const isEmpty = items.length === 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-zinc-900/40 backdrop-blur-[2px]"
          />
          <motion.div
            key="cart-sheet"
            role="dialog"
            aria-modal="true"
            aria-label={lang === "it" ? "Carrello" : "Cart"}
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
            className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[85vh] max-w-md flex-col rounded-t-[30px] bg-[#FDFBF7] px-6 pb-8 shadow-[0_-24px_70px_rgba(60,20,25,0.35)]"
          >
            <div className="mx-auto mt-3 h-1.5 w-11 shrink-0 rounded-full bg-zinc-300" />

            {view === "cart" && (
              <button
                type="button"
                onClick={onClose}
                aria-label={lang === "it" ? "Chiudi" : "Close"}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#722F37]/20 bg-white text-[#722F37]"
              >
                <X className="h-4 w-4" strokeWidth={2.2} />
              </button>
            )}

            {view === "cart" ? (
              <>
                <h2 className="mt-5 shrink-0 text-center font-serif text-3xl font-bold text-zinc-900">
                  {lang === "it" ? "Il tuo ordine" : "Your order"}
                </h2>

                {isEmpty ? (
                  <p className="py-16 text-center text-sm text-zinc-500">
                    {lang === "it" ? "Il carrello è vuoto." : "Your cart is empty."}
                  </p>
                ) : (
                  <ul className="mt-5 min-h-0 flex-1 space-y-1 overflow-y-auto">
                    {items.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center gap-3 border-b border-[#722F37]/10 py-3 last:border-none"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-serif text-base font-bold leading-tight text-zinc-900">
                            {item.nome}
                          </p>
                          <p className="mt-0.5 text-xs text-zinc-500">
                            {formatPrice(item.prezzo)} {lang === "it" ? "cad." : "each"}
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantita - 1)}
                            aria-label={lang === "it" ? "Diminuisci quantità" : "Decrease quantity"}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#722F37]/30 text-[#722F37] transition-colors hover:bg-[#722F37]/10"
                          >
                            <Minus className="h-3.5 w-3.5" strokeWidth={2.4} />
                          </button>
                          <span className="w-5 text-center text-sm font-bold text-zinc-900">{item.quantita}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantita + 1)}
                            aria-label={lang === "it" ? "Aumenta quantità" : "Increase quantity"}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#722F37]/30 text-[#722F37] transition-colors hover:bg-[#722F37]/10"
                          >
                            <Plus className="h-3.5 w-3.5" strokeWidth={2.4} />
                          </button>
                        </div>

                        <p className="w-16 shrink-0 text-right font-serif text-sm font-bold text-[#722F37]">
                          {formatPrice(item.prezzo * item.quantita)}
                        </p>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          aria-label={lang === "it" ? "Rimuovi articolo" : "Remove item"}
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-[#722F37]/10 hover:text-[#722F37]"
                        >
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={2.2} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-4 shrink-0 border-t border-[#722F37]/15 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold uppercase tracking-widest text-zinc-500">
                      {lang === "it" ? "Totale" : "Total"}
                    </span>
                    <span className="font-serif text-2xl font-bold text-[#722F37]">{formatPrice(totalPrice)}</span>
                  </div>

                  <button
                    type="button"
                    disabled={isEmpty}
                    onClick={() => setView("summary")}
                    className="mt-4 w-full rounded-2xl bg-[#722F37] py-4 text-[13px] font-extrabold uppercase tracking-[0.14em] text-[#FDFBF7] transition-all hover:bg-[#5E262E] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {lang === "it" ? "Completa ordine" : "Complete order"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="mt-5 shrink-0 text-center font-serif text-3xl font-bold text-zinc-900">
                  {lang === "it" ? "Riepilogo ordine" : "Order summary"}
                </h2>
                <p className="mt-1 shrink-0 text-center text-xs uppercase tracking-widest text-zinc-400">
                  {lang === "it" ? "Da mostrare al personale" : "Show this to the staff"}
                </p>

                <ul className="mt-6 min-h-0 flex-1 space-y-4 overflow-y-auto">
                  {items.map((item) => (
                    <li key={item.id} className="flex items-baseline justify-between gap-4">
                      <span className="font-serif text-lg font-bold text-zinc-900">
                        {item.quantita}× {item.nome}
                      </span>
                      <span className="shrink-0 font-serif text-lg font-bold text-[#722F37]">
                        {formatPrice(item.prezzo * item.quantita)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 shrink-0 border-t border-[#722F37]/20 pt-5">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-xl font-bold text-zinc-900">
                      {lang === "it" ? "Totale" : "Total"}
                    </span>
                    <span className="font-serif text-3xl font-bold text-[#722F37]">{formatPrice(totalPrice)}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setView("cart")}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#722F37]/30 bg-white/60 py-4 text-[13px] font-extrabold uppercase tracking-[0.14em] text-[#722F37] transition-colors hover:bg-[#722F37]/10"
                  >
                    <ArrowLeft className="h-4 w-4" strokeWidth={2.4} />
                    {lang === "it" ? "Modifica ordine" : "Edit order"}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
