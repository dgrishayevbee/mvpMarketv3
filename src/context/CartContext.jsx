import { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorage("mvpmarket:cart", []);

  const value = useMemo(() => {
    const addItem = (product, qty = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.id === product.id);
        if (existing) {
          return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty } : i));
        }
        return [
          ...prev,
          {
            id: product.id,
            title: product.title,
            price: product.price,
            seller: product.seller,
            qty,
            // Витринные поля карточки — чтобы на оформлении заказа показать
            // тот же вид карточки, что и на главной, без похода в контент.
            subtitle: product.subtitle || "",
            icon: product.icon || "",
            imageUrl: product.imageUrl || "",
            features: product.features || [],
            tags: product.tags || [],
          },
        ];
      });
    };

    const removeItem = (id) => {
      setItems((prev) => prev.filter((i) => i.id !== id));
    };

    const setQty = (id, qty) => {
      if (qty <= 0) {
        removeItem(id);
        return;
      }
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
    };

    const clear = () => setItems([]);

    const count = items.reduce((sum, i) => sum + i.qty, 0);
    const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);

    return { items, addItem, removeItem, setQty, clear, count, subtotal };
  }, [items, setItems]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
