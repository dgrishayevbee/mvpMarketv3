import { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage("mvpmarket:auth-user", null);
  const [sellerMode, setSellerMode] = useLocalStorage("mvpmarket:seller-mode", false);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      sellerMode: !!user && sellerMode,
      login(email) {
        setUser({ name: email.split("@")[0] || "Пользователь", email });
      },
      register(name, email) {
        setUser({ name: name || email.split("@")[0] || "Пользователь", email });
      },
      // B2B-регистрация: аккаунт заводится на компанию, подписант известен
      // из сертификата ЭЦП.
      registerCompany({ company, bin, signer, iin, email, phone }) {
        setUser({
          name: signer || company || "Пользователь",
          email,
          phone,
          company,
          bin,
          iin,
          method: "ecp",
        });
      },
      logout() {
        setUser(null);
        setSellerMode(false);
      },
      enterSellerMode() {
        setSellerMode(true);
      },
      exitSellerMode() {
        setSellerMode(false);
      },
    }),
    [user, sellerMode, setUser, setSellerMode]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
