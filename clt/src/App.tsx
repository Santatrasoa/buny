import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { CartProvider } from "./hooks/useCart";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import Home from "./pages/Home/Home";
import Shop from "./pages/Shop/Shop";
import ProductDetail from "./pages/Products/ProductDetail";
import Contact from "./pages/Contact/Contact";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/Dashboard";
import { AdminProducts, AdminProductForm } from "./pages/Admin/Products";
import { AdminUsers, AdminUserForm } from "./pages/Admin/Users";

/* ─── Layout public ───────────────────────────────────────────────
   Header sticky (z-50). Le contenu se place naturellement dessous.
   pb-16 md:pb-0 : espace pour la barre mobile fixe en bas.
──────────────────────────────────────────────────────────────────── */
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/"            element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/shop"        element={<PublicLayout><Shop /></PublicLayout>} />
      <Route path="/products/:id" element={<PublicLayout><ProductDetail /></PublicLayout>} />
      <Route path="/contact"     element={<PublicLayout><Contact /></PublicLayout>} />
      <Route path="/login"       element={<PublicLayout><Login /></PublicLayout>} />
      <Route path="/register"    element={<PublicLayout><Register /></PublicLayout>} />

      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="products"          element={<AdminProducts />} />
        <Route path="products/new"      element={<AdminProductForm />} />
        <Route path="products/:id/edit" element={<AdminProductForm />} />
        <Route path="users"             element={<AdminUsers />} />
        <Route path="users/new"         element={<AdminUserForm />} />
        <Route path="users/:id/edit"    element={<AdminUserForm />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
