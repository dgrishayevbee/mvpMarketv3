import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ContentProvider } from "./context/ContentContext.jsx";
import { ProductsProvider } from "./context/ProductsContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { FavoritesProvider } from "./context/FavoritesContext.jsx";
import { OrdersProvider } from "./context/OrdersContext.jsx";
import { UIProvider } from "./context/UIContext.jsx";

import { Layout } from "./components/layout/Layout.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { ProductPage } from "./pages/ProductPage.jsx";
import { CartPage } from "./pages/CartPage.jsx";
import { CheckoutPage } from "./pages/CheckoutPage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { RegisterPage } from "./pages/RegisterPage.jsx";
import { ProfilePage } from "./pages/ProfilePage.jsx";
import { AdminPage } from "./pages/AdminPage.jsx";
import { NotFoundPage } from "./pages/NotFoundPage.jsx";

import { SellerLayout } from "./pages/seller/SellerLayout.jsx";
import { SellerDashboardPage } from "./pages/seller/SellerDashboardPage.jsx";
import { SellerProductsPage } from "./pages/seller/SellerProductsPage.jsx";
import { SellerProductFormPage } from "./pages/seller/SellerProductFormPage.jsx";
import { SellerOrdersPage } from "./pages/seller/SellerOrdersPage.jsx";

function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ContentProvider>
        <ProductsProvider>
          <CartProvider>
            <FavoritesProvider>
              <OrdersProvider>
                <UIProvider>{children}</UIProvider>
              </OrdersProvider>
            </FavoritesProvider>
          </CartProvider>
        </ProductsProvider>
      </ContentProvider>
    </AuthProvider>
  );
}

function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />

            <Route path="/seller" element={<SellerLayout />}>
              <Route index element={<SellerDashboardPage />} />
              <Route path="products" element={<SellerProductsPage />} />
              <Route path="products/new" element={<SellerProductFormPage />} />
              <Route path="products/:id/edit" element={<SellerProductFormPage />} />
              <Route path="orders" element={<SellerOrdersPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
