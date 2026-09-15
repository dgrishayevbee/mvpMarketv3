import { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { useContent } from "./ContentContext.jsx";

const ProductsContext = createContext(null);

function makeId() {
  return "sp_" + Math.random().toString(36).slice(2, 10);
}

export function ProductsProvider({ children }) {
  const { content } = useContent();
  const [sellerProducts, setSellerProducts] = useLocalStorage("mvpmarket:seller-products", []);

  const value = useMemo(() => {
    const all = [...sellerProducts, ...content.solutions];

    const getById = (id) => all.find((p) => p.id === id) || null;

    const listBySeller = (sellerName) => sellerProducts.filter((p) => p.seller === sellerName);

    const addProduct = (data, sellerName) => {
      const product = {
        id: makeId(),
        rating: 0,
        reviewsCount: 0,
        badges: [],
        stock: 0,
        ...data,
        seller: sellerName,
      };
      setSellerProducts((prev) => [product, ...prev]);
      return product;
    };

    const updateProduct = (id, patch) => {
      setSellerProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    };

    const deleteProduct = (id) => {
      setSellerProducts((prev) => prev.filter((p) => p.id !== id));
    };

    return { all, getById, listBySeller, addProduct, updateProduct, deleteProduct };
  }, [sellerProducts, setSellerProducts, content.solutions]);

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
}
