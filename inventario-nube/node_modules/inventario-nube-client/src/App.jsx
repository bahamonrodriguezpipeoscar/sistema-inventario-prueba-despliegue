import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import RegisterInfo from "./pages/RegisterInfo";
import Layout from "./pages/Layout";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Stock from "./pages/Stock";
import NotFound from "./pages/NotFound";

/**
 * Enrutamiento principal:
 * - /login: acceso público
 * - /app/*: dashboard protegido (requiere token)
 */
export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<RegisterInfo />} />

        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="productos" element={<Products />} />
          <Route path="categorias" element={<Categories />} />
          <Route path="stock" element={<Stock />} />
          <Route index element={<Navigate to="/app/productos" replace />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}
