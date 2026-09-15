/**
 * Tipi e interfacce per il menu digitale di Villa Manin (4D Smart Menu).
 * Rappresentano la struttura dati di `data/menu.json`.
 */

export type Language = "it" | "en";

export interface LocalizedString {
  it: string;
  en?: string;
  [key: string]: string | undefined;
}

/** Lista di stringhe localizzata (es. ingredienti IT/EN). */
export interface LocalizedList {
  it: string[];
  en?: string[];
}

/** Una sezione del menu (es. Bar, Ristorante). */
export interface Section {
  id: string;
  label: LocalizedString | string;
  active: boolean;
}

/** Varianti selezionabili (es. gusti) per un articolo. */
export interface DishOption {
  id: string;
  nome: LocalizedString | string;
  image?: string;
  /** Prezzo specifico per questa opzione. Se assente, si usa il prezzo base del piatto. */
  prezzo?: number;
}

/** Un singolo articolo (drink, snack o piatto) del menu. */
export interface Dish {
  id: string;
  nome: LocalizedString | string;
  descrizione?: LocalizedString | string;
  /** Prezzo in euro come numero (es. 12.5). La formattazione avviene in UI. */
  prezzo: number;
  /** URL a una WebP con sfondo trasparente (in `public/`), es. "/dishes/burger.webp". Se manca, la card mostra un segnaposto. */
  image?: string;
  /** Ingredienti localizzati, mostrati come pillole nella modale di dettaglio. */
  ingredients: LocalizedList;
  /** Id dei tag (chiavi di `lib/tags.ts`), es. ["veg", "novita"]. */
  tags: string[];
  /** Opzioni o varianti selezionabili (es. gusti). */
  options?: DishOption[];
}

/** Una categoria del menu che raggruppa più articoli. */
export interface Category {
  id: string;
  section: string;
  name: LocalizedString | string;
  /** Chiave dell'icona Lucide usata da CategorySlider (es. "utensils", "martini"). */
  icon: string;
  items: Dish[];
}

/** Struttura radice del menu. */
export interface Menu {
  ristorante?: string;
  sottotitolo?: string;
  sections: Section[];
  categories: Category[];
}

/** Estrae il testo localizzato in base alla lingua. */
export function getLocalizedText(
  value: LocalizedString | string | undefined,
  lang: Language = "it",
): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[lang] ?? value.it ?? "";
}

/** Estrae una lista localizzata in base alla lingua. */
export function getLocalizedList(
  value: LocalizedList | undefined,
  lang: Language = "it",
): string[] {
  if (!value) return [];
  return value[lang] ?? value.it ?? [];
}
