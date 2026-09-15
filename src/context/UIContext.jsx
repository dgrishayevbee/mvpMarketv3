import { createContext, useContext, useMemo, useState } from "react";

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [quickViewId, setQuickViewId] = useState(null);

  const value = useMemo(
    () => ({
      cartOpen,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),

      filtersOpen,
      openFilters: () => setFiltersOpen(true),
      closeFilters: () => setFiltersOpen(false),

      quickViewId,
      openQuickView: (id) => setQuickViewId(id),
      closeQuickView: () => setQuickViewId(null),
    }),
    [cartOpen, filtersOpen, quickViewId]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within UIProvider");
  return ctx;
}
