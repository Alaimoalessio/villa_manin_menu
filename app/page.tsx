"use client";

import { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, ShoppingBag } from "lucide-react";
import menuData from "@/data/menu.json";
import { type Dish, type Language, type Menu, getLocalizedText } from "@/types/menu";
import { CategorySlider } from "@/components/CategorySlider";
import { MenuItem3D } from "@/components/MenuItem3D";
import { ItemDetailSheet } from "@/components/ItemDetailSheet";
import { CartSheet } from "@/components/CartSheet";
import { useCart } from "@/lib/cart-context";

const menu = menuData as unknown as Menu;

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const [lang, setLang] = useState<Language>("it");
  const [activeCat, setActiveCat] = useState(menu.categories[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(true);
  const [selected, setSelected] = useState<Dish | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const { totalItems } = useCart();

  const searching = query.trim().length > 0;

  useEffect(() => {
    setIsMounted(true);
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const time = hours + minutes / 60;
    // Orari fittizi: Pranzo 12:00-14:30 e Cena 19:00-22:30
    setIsRestaurantOpen((time >= 12 && time <= 14.5) || (time >= 19 && time <= 22.5));
  }, []);

  const sectionCategories = useMemo(() => {
    return menu.categories.filter((c) => c.section === activeSection);
  }, [activeSection]);

  // Con una ricerca attiva si cerca in tutte le categorie della SEZIONE ATTIVA
  const dishes = useMemo(() => {
    if (searching) {
      const q = query.trim().toLowerCase();
      return sectionCategories
        .flatMap((c) => c.items)
        .filter((d) =>
          [getLocalizedText(d.nome, lang), ...(d.ingredients.it ?? []), ...(d.ingredients.en ?? [])]
            .join(" ")
            .toLowerCase()
            .includes(q),
        );
    }
    return sectionCategories.find((c) => c.id === activeCat)?.items ?? [];
  }, [searching, query, lang, activeCat, sectionCategories]);

  const activeName = getLocalizedText(sectionCategories.find((c) => c.id === activeCat)?.name, lang);

  if (!isMounted) return null;

  if (activeSection === null) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center border-x border-[#722F37]/10 bg-[#FDFBF7] p-6 text-zinc-900 shadow-2xl">
        <div className="mb-12 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500">
            {lang === "it" ? "Dimora Storica" : "Historic Villa"}
          </p>
          <h1 className="mt-2 font-serif text-5xl font-bold tracking-wide text-[#722F37]">Villa Manin</h1>
          <p className="mt-4 text-sm text-zinc-600">
            {lang === "it" ? "Scegli l'area del menù" : "Choose the menu area"}
          </p>
        </div>

        <div className="flex w-full flex-col gap-4">
          <button
            onClick={() => {
              setActiveSection("bar");
              setActiveCat(menu.categories.find((c) => c.section === "bar")?.id ?? "");
            }}
            className="group flex flex-col items-center justify-center rounded-3xl border border-[#722F37]/20 bg-white p-8 shadow-sm transition-all hover:border-[#722F37]/50 hover:bg-[#722F37]/5 active:scale-95"
          >
            <span className="mb-2 text-4xl">☕️</span>
            <h2 className="font-serif text-2xl font-bold text-[#722F37]">Bar & Drinks</h2>
            <p className="mt-1 text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">
              {lang === "it" ? "Sempre aperto" : "Always open"}
            </p>
          </button>

          <button
            onClick={() => {
              if (isRestaurantOpen) {
                setActiveSection("restaurant");
                setActiveCat(menu.categories.find((c) => c.section === "restaurant")?.id ?? "");
              }
            }}
            className={`group flex flex-col items-center justify-center rounded-3xl border p-8 shadow-sm transition-all ${
              isRestaurantOpen
                ? "border-[#722F37]/20 bg-white hover:border-[#722F37]/50 hover:bg-[#722F37]/5 active:scale-95"
                : "cursor-not-allowed border-zinc-200 bg-zinc-50 opacity-60"
            }`}
          >
            <span className="mb-2 text-4xl">🍝</span>
            <h2 className={`font-serif text-2xl font-bold ${isRestaurantOpen ? "text-[#722F37]" : "text-zinc-400"}`}>
              Ristorante
            </h2>
            <p className="mt-1 text-center text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">
              {isRestaurantOpen
                ? lang === "it"
                  ? "Cucina Aperta"
                  : "Kitchen Open"
                : lang === "it"
                  ? "Cucina chiusa (12:00-14:30 | 19:00-22:30)"
                  : "Kitchen closed (12:00-14:30 | 19:00-22:30)"}
            </p>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setLang(lang === "it" ? "en" : "it")}
          className="mt-10 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#722F37] underline underline-offset-4 opacity-70"
        >
          {lang === "it" ? "Switch to English" : "Passa all'italiano"}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-md border-x border-[#722F37]/10 bg-[#FDFBF7] text-zinc-900 shadow-2xl">
      {/* A. Header & Search */}
      <header className="px-4 pb-2 pt-6">
        <div className="grid grid-cols-[44px_1fr_44px] items-center gap-2">
          <button
            type="button"
            onClick={() => setLang(lang === "it" ? "en" : "it")}
            aria-label={lang === "it" ? "Switch to English" : "Passa all'italiano"}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#722F37]/25 bg-white text-xs font-extrabold tracking-widest text-[#722F37] transition-colors hover:bg-[#722F37]/5"
          >
            {lang === "it" ? "EN" : "IT"}
          </button>
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
              {lang === "it" ? "Dimora Storica" : "Historic Villa"}
            </p>
            <h1 className="font-serif text-3xl font-semibold tracking-wide text-[#722F37]">Villa Manin</h1>
          </div>
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            aria-label={lang === "it" ? "Cerca" : "Search"}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#722F37]/25 bg-white text-[#722F37] transition-colors hover:bg-[#722F37]/5"
          >
            <Search className="h-[18px] w-[18px]" strokeWidth={2} />
          </button>
        </div>

        {/* Tab Bar Bar/Ristorante */}
        <div className="mt-5 flex rounded-full bg-[#722F37]/10 p-1">
          <button
            onClick={() => {
              setActiveSection("bar");
              setActiveCat(menu.categories.find((c) => c.section === "bar")?.id ?? "");
              setQuery("");
            }}
            className={`flex-1 rounded-full py-2.5 text-[11px] font-extrabold uppercase tracking-widest transition-all ${
              activeSection === "bar" ? "bg-[#722F37] text-white shadow-md" : "text-[#722F37] hover:bg-[#722F37]/10"
            }`}
          >
            Bar & Drinks
          </button>
          <button
            onClick={() => {
              if (isRestaurantOpen) {
                setActiveSection("restaurant");
                setActiveCat(menu.categories.find((c) => c.section === "restaurant")?.id ?? "");
                setQuery("");
              } else {
                alert(lang === "it" ? "La cucina è attualmente chiusa." : "The kitchen is currently closed.");
              }
            }}
            className={`flex-1 rounded-full py-2.5 text-[11px] font-extrabold uppercase tracking-widest transition-all ${
              activeSection === "restaurant"
                ? "bg-[#722F37] text-white shadow-md"
                : isRestaurantOpen
                  ? "text-[#722F37] hover:bg-[#722F37]/10"
                  : "text-zinc-400 opacity-50"
            }`}
          >
            Ristorante
          </button>
        </div>

        <AnimatePresence initial={false}>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <label className="mt-3.5 flex items-center gap-2.5 rounded-full border border-[#722F37]/35 bg-white/85 px-4 py-2.5 shadow-sm">
                <Search className="h-[17px] w-[17px] shrink-0 text-[#722F37]" strokeWidth={2} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={lang === "it" ? "Cerca un piatto o ingrediente…" : "Search dishes or ingredients…"}
                  className="w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
                />
              </label>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* B. Navigazione categorie a icone della sezione attiva */}
      <CategorySlider
        categories={sectionCategories.map((c) => ({
          id: c.id,
          name: getLocalizedText(c.name, lang),
          icon: c.icon,
        }))}
        activeId={searching ? "" : activeCat}
        onSelect={(id) => {
          setActiveCat(id);
          setQuery("");
        }}
      />

      {/* C. Lista piatti con effetto 3D overlap */}
      <main className="px-5 pb-16 pt-1">
        <div className="flex items-center gap-2.5 pt-4">
          <span className="h-[22px] w-1.5 rounded-full bg-[#722F37]/80" aria-hidden />
          <h2 className="font-serif text-2xl font-bold text-[#722F37]">
            {searching ? `${lang === "it" ? "Risultati" : "Results"} (${dishes.length})` : activeName}
          </h2>
        </div>

        <motion.ul layout className="grid grid-cols-1 gap-4 pt-6">
          <AnimatePresence mode="popLayout">
            {dishes.map((dish) => (
              <MenuItem3D key={dish.id} dish={dish} lang={lang} onOpen={setSelected} />
            ))}
          </AnimatePresence>
        </motion.ul>

        {dishes.length === 0 && (
          <p className="py-10 text-center text-sm text-zinc-500">
            {lang === "it" ? "Nessun risultato per la ricerca." : "No results found."}
          </p>
        )}
      </main>

      <footer className="border-t border-[#722F37]/15 px-6 py-8 text-center text-xs leading-relaxed text-zinc-600">
        <p>
          {lang === "it"
            ? "I prezzi sono espressi in euro (€) e comprensivi di IVA. Per informazioni su ingredienti e allergeni rivolgersi al personale."
            : "Prices are in Euros (€) and include VAT. Please ask our staff for any information regarding ingredients or allergens."}
        </p>
      </footer>

      {/* E. Pulsante flottante carrello */}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-30 mx-auto max-w-md px-5">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={lang === "it" ? "Apri carrello" : "Open cart"}
            className="pointer-events-auto relative flex h-14 w-14 items-center justify-center rounded-full bg-[#722F37] text-[#FDFBF7] shadow-lg shadow-[#722F37]/40 transition-transform active:scale-95"
          >
            <ShoppingBag className="h-6 w-6" strokeWidth={2} />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FDFBF7] px-1 text-[11px] font-extrabold text-[#722F37] shadow">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* D. Bottom Sheet di dettaglio */}
      <ItemDetailSheet dish={selected} lang={lang} onClose={() => setSelected(null)} />

      {/* F. Bottom Sheet del carrello */}
      <CartSheet open={cartOpen} lang={lang} onClose={() => setCartOpen(false)} />
    </div>
  );
}
