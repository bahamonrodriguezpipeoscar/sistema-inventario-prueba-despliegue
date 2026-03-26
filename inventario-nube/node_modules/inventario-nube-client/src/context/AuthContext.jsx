import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../api/http";

/**
 * AuthContext:
 * - Guarda token y usuario en localStorage.
 * - Permite login/logout.
 */
const AuthContext = createContext(null);

const LS_TOKEN = "inventario_token";
const LS_USER = "inventario_user";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(LS_TOKEN) || "");
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(LS_USER);
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) localStorage.setItem(LS_TOKEN, token);
    else localStorage.removeItem(LS_TOKEN);
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem(LS_USER, JSON.stringify(user));
    else localStorage.removeItem(LS_USER);
  }, [user]);

  async function login({ email, password, role }) {
    setLoading(true);
    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: { email, password, role }
      });
      setToken(data.token);
      setUser(data.user);
      return { ok: true };
    } catch (e) {
      setToken("");
      setUser(null);
      return { ok: false, message: e.message };
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    // Limpieza total.
    setToken("");
    setUser(null);
  }

  async function refreshMe() {
    if (!token) return;
    try {
      const me = await apiFetch("/api/me", { token });
      setUser(me.user);
    } catch {
      // Si falla, forzamos cierre de sesión.
      logout();
    }
  }

  useEffect(() => {
    refreshMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => ({ token, user, loading, login, logout }), [token, user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
