import { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
  id: string;
  title: string;
  map: string;
  price: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => boolean; // ✅ returns success/failure
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: number;
  isInCart: (id: string) => boolean;
};

const CartContext = createContext<CartContextType | null>(null);

const CART_KEY = "e4a_cart_items";

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  // ✅ Lazy init from localStorage
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // ✅ Persist cart
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  // ✅ Check if item already exists
  const isInCart = (id: string) => {
    return items.some((item) => item.id === id);
  };

  // ✅ Add item safely (NO duplicates)
  const addItem = (item: CartItem): boolean => {
    if (items.some((i) => i.id === item.id)) {
      return false; // ❌ already in cart
    }

    setItems((prev) => [...prev, item]);
    return true; // ✅ added successfully
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem(CART_KEY);
  };

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, clearCart, total, isInCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
