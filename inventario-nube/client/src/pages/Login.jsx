import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";

/**
 * Login:
 * - Fondo cielo (body).
 * - Tarjeta blanca para usuario/contraseña (requisito del usuario).
 * - Logo cuadrado semi redondo centrado.
 * - Botón centrado de iniciar sesión.
 * - Selección de rol (Administrador/Colaborador).
 */
export default function Login() {
  const nav = useNavigate();
  const { login, loading } = useAuth();

  // Credenciales precargadas como lo pidió el usuario.
  const [email, setEmail] = useState("oscarbahamon@gmail.com");
  const [password, setPassword] = useState("Oscar1234567*");
  const [role, setRole] = useState("admin");

  const [toast, setToast] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    const res = await login({ email, password, role });
    if (!res.ok) {
      setToast(res.message || "Credenciales inválidas.");
      return;
    }
    nav("/app/productos");
  }

  return (
    <div className="container" style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "34px 0" }}>
      <div className="card" style={{ width: "min(560px, 92vw)", padding: 20 }}>
        <div style={{ display: "grid", placeItems: "center", gap: 10 }}>
          <img
            src={logo}
            alt="Logo"
            style={{
              width: 108,
              height: 108,
              borderRadius: 24,
              display: "block",
              objectFit: "cover",
              boxShadow: "0 14px 30px rgba(10,27,34,0.14)"
            }}
          />
          <div style={{ fontWeight: 1000, fontSize: 22, textAlign: "center" }}>Sistema de Inventario en la Nube</div>
          <div className="muted" style={{ textAlign: "center" }}>
          
          </div>
        </div>

        {/* Selector de rol (botón/toggle) */}
        <div style={{ marginTop: 18, display: "grid", gap: 10 }}>
          <div style={{ fontWeight: 900 }}>Selecciona tu rol</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <button
              type="button"
              className={`btn ${role === "admin" ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setRole("admin")}
            >
              Administrador
            </button>
            <button
              type="button"
              className={`btn ${role === "collab" ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setRole("collab")}
            >
              Colaborador
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} style={{ marginTop: 16, display: "grid", gap: 12 }}>
          {/* IMPORTANTE: el "div/container" donde va usuario y contraseña es blanco (la card completa lo es). */}
          <div style={{ display: "grid", gap: 8 }}>
            <label style={{ fontWeight: 900 }}>Usuario</label>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@dominio.com" />
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <label style={{ fontWeight: 900 }}>Contraseña</label>
            <input className="input" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" />
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: 6 }}>
            {loading ? "Validando..." : "Iniciar sesión"}
          </button>

          <div style={{ textAlign: "center", marginTop: 4 }}>
            <span className="muted">Si no estás registrado, </span>
            <Link to="/registro" style={{ fontWeight: 900, textDecoration: "underline" }}>
              ingresa aquí
            </Link>
          </div>
        </form>
      </div>

      <Toast message={toast} type="error" onClose={() => setToast("")} />
    </div>
  );
}
