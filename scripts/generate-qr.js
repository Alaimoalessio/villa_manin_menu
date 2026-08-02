/**
 * Genera il QR code che punta al menu digitale.
 *
 * Uso:
 *   npm run generate-qr                              # usa http://localhost:3000
 *   MENU_URL=https://menu.mioristorante.it npm run generate-qr
 */

const path = require("path");
const QRCode = require("qrcode");

const MENU_URL = process.env.MENU_URL || "http://localhost:3000";
const OUTPUT_PATH = path.join(__dirname, "..", "public", "qr-menu.png");

async function main() {
  await QRCode.toFile(OUTPUT_PATH, MENU_URL, {
    type: "png",
    errorCorrectionLevel: "H",
    width: 1000,
    margin: 2,
  });

  console.log(`URL codificato: ${MENU_URL}`);
  console.log(`QR code generato in: ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error("Errore nella generazione del QR code:", err);
  process.exit(1);
});
