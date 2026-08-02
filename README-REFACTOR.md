# Villa Manin — Refactor "4D Smart Menu"

Refactoring del menu digitale con UX premium: slider categorie a icone,
card con immagine PNG trasparente sporgente (effetto 3D overlap) e
Bottom Sheet di dettaglio animata con Framer Motion.

## Installazione

```bash
npm install framer-motion
```

## File da copiare nel progetto

```
types/menu.ts                    # + image, ingredients (IT/EN), tags, icon
data/menu.json                   # dati mock aggiornati
lib/tags.ts                      # NUOVO: etichette e stili dei tag
components/CategorySlider.tsx    # NUOVO: nav categorie a icone
components/MenuItem3D.tsx        # NUOVO: card con immagine sporgente
components/ItemDetailSheet.tsx   # NUOVO: bottom sheet Framer Motion
app/page.tsx                     # assembla tutto (header, search, lista)
app/globals.css                  # + utility `scrollbar-hide` (Tailwind v4)
```

I vecchi `Header.tsx`, `CategoryNav.tsx`, `MenuSection.tsx` e `MenuItem.tsx`
non sono più usati e possono essere rimossi. `lib/format.ts` resta invariato.

## Immagini piatti

Le card richiedono PNG **con sfondo trasparente** in `public/dishes/`:
`burger.png`, `patatine.png`, `tagliere.png`, `bruschetta.png`,
`spritz.png`, `espresso.png`, `birra.png`, `tiramisu.png`.
Nel prototipo HTML allegato trovi dei segnaposto (`images/`) da sostituire
con foto reali scontornate (~480×480).

## Note

- Tema: sfondo avorio `#FDFBF7`, accento Bordeaux `#722F37`, testi zinc-900/600.
- La sheet si chiude con: bottone, X, tap sull'overlay o drag verso il basso.
- La ricerca filtra su nome e ingredienti in entrambe le lingue e ignora
  la categoria attiva quando è presente una query.
