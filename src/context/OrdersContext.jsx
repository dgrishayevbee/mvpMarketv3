import { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

const OrdersContext = createContext(null);

function makeOrderId() {
  return "ORD-" + Math.floor(100000 + Math.random() * 900000);
}

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useLocalStorage("mvpmarket:orders", []);

  const value = useMemo(() => {
    const createOrder = ({ items, total, payment, buyerEmail }) => {
      const order = {
        id: makeOrderId(),
        date: new Date().toISOString(),
        status: "Оформлен",
        items,
        total,
        payment,
        buyerEmail,
      };
      setOrders((prev) => [order, ...prev]);
      return order;
    };

    const listForSeller = (sellerName) =>
      orders
        .map((order) => ({
          ...order,
          items: order.items.filter((i) => i.seller === sellerName),
        }))
        .filter((order) => order.items.length > 0);

    const setStatus = (orderId, status) => {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    };

    return { orders, createOrder, listForSeller, setStatus };
  }, [orders, setOrders]);

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}
