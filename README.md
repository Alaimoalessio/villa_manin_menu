# Menu Digitale — Trattoria Da Nonna Rosa

Menu digitale mobile-first per ristorante, pensato per essere scansionato tramite QR code e consultato da smartphone. Costruito con **Next.js (App Router)**, **TypeScript**, **Tailwind CSS** e **Lucide React**.

## Caratteristiche

- 📱 **Mobile-first**: layout centrato (`max-w-md`), aspetto da app nativa anche su desktop.
- 🧭 **Navigazione categorie sticky** con scroll orizzontale e scroll-spy (evidenzia la categoria visibile).
- 🍽️ **Card piatti pulite**: nome, descrizione, prezzo in evidenza, badge vegetariano / senza glutine e allergeni.
- 🔗 **Dati statici** in `data/menu.json`, tipizzati in `types/menu.ts`.
- 📷 **Generatore di QR code** verso l'URL del menu.

## Avvio

```bash
npm install
npm run dev      # http://localhost:3000
```

Build di produzione:

```bash
npm run build && npm run start
```

## Generare il QR code

Genera `public/qr-menu.png`:

```bash
# URL di default (http://localhost:3000)
npm run generate-qr

# URL personalizzato (dominio di produzione)
node scripts/generate-qr.js https://menu.mioristorante.it
# oppure
MENU_URL=https://menu.mioristorante.it npm run generate-qr
```

## Struttura del progetto

```
app/
  layout.tsx        # layout root, metadata, viewport
  page.tsx          # assembla i componenti e carica il JSON
  globals.css       # Tailwind + tema brand
components/
  Header.tsx        # nome ristorante + logo
  CategoryNav.tsx   # barra categorie sticky (client, scroll-spy)
  MenuSection.tsx   # sezione di una categoria
  MenuItem.tsx      # card del singolo piatto
data/menu.json      # dati mock del menu
types/menu.ts       # interfacce TypeScript
lib/format.ts       # formattazione prezzo in euro
scripts/generate-qr.js
```

## Modificare il menu

Basta editare `data/menu.json` rispettando le interfacce in `types/menu.ts`. Per collegare un backend/CMS in futuro è sufficiente sostituire l'import statico in `app/page.tsx` con un fetch dei dati.

## Nota sulle vulnerabilità `npm audit`

`npm audit` segnala advisory in dipendenze **transitive annidate** di Next.js (`postcss` e `sharp`). Il fix automatico proposto (`npm audit fix --force`) declasserebbe Next.js alla v9 — **da non eseguire**. Riguardano strumenti di build e non impattano il menu servito in produzione; si risolvono con i normali aggiornamenti minori di Next.js.
