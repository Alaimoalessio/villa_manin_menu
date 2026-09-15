/**
 * Segnaposto per i piatti senza fotografia: un medaglione color vino con
 * l'iniziale del nome, nella stessa posizione dell'immagine sporgente,
 * così la card mantiene lo stesso ritmo di quelle con la foto.
 */
export function DishPlaceholder({ name, size = "sm" }: { name: string; size?: "sm" | "lg" }) {
  const initial = name.trim().charAt(0).toUpperCase() || "·";
  const dim = size === "lg" ? "h-40 w-40 text-7xl" : "h-24 w-24 text-4xl";
  return (
    <span
      aria-hidden="true"
      className={`${dim} flex items-center justify-center rounded-full border border-[#722F37]/20 bg-gradient-to-br from-[#fbf3ee] to-[#f1dcd6] font-serif font-bold text-[#722F37]/70 shadow-[0_14px_24px_-16px_rgba(114,47,55,0.45)]`}
    >
      {initial}
    </span>
  );
}
