import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';

export const metadata: Metadata = {
  title: 'Villa Manin 4D Smart Menu',
  description: 'Menu digitale per ristorante',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className="antialiased bg-[#FDFBF7] text-zinc-900">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
