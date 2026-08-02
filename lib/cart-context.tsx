"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

/** Riga del carrello: un piatto/drink (con eventuale opzione/gusto scelto) e la sua quantità. */
export interface CartItem {
  /** Chiave univoca della riga: dishId + optionId, per distinguere varianti dello stesso piatto. */
  id: string;
  dishId: string;
  nome: string;
  prezzo: number;
  quantita: number;
  optionId?: string;
  optionNome?: string;
}

export interface AddToCartInput {
  dishId: string;
  nome: string;
  prezzo: number;
  quantita?: number;
  optionId?: string;
  optionNome?: string;
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (input: AddToCartInput) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantita: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function buildLineId(dishId: string, optionId?: string) {
  return optionId ? `${dishId}::${optionId}` : dishId;
}

/**
 * Stato carrello in memoria (nessun localStorage, nessuna chiamata di rete):
 * si azzera al reload della pagina, comportamento accettato per l'ordinazione al tavolo.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback(({ dishId, nome, prezzo, quantita = 1, optionId, optionNome }: AddToCartInput) => {
    const id = buildLineId(dishId, optionId);
    setItems((prev) => {
      const existing = prev.find((it) => it.id === id);
      if (existing) {
        return prev.map((it) => (it.id === id ? { ...it, quantita: it.quantita + quantita } : it));
      }
      return [...prev, { id, dishId, nome, prezzo, quantita, optionId, optionNome }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantita: number) => {
    setItems((prev) => {
      if (quantita <= 0) return prev.filter((it) => it.id !== id);
      return prev.map((it) => (it.id === id ? { ...it, quantita } : it));
    });
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = useMemo(() => items.reduce((sum, it) => sum + it.quantita, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((sum, it) => sum + it.quantita * it.prezzo, 0), [items]);

  const value = useMemo<CartContextValue>(
    () => ({ items, totalItems, totalPrice, addToCart, removeFromCart, updateQuantity, clearCart }),
    [items, totalItems, totalPrice, addToCart, removeFromCart, updateQuantity, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve essere usato dentro un CartProvider");
  return ctx;
}
