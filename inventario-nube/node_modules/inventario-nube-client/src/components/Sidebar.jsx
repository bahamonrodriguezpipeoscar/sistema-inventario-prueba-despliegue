import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import "./sidebar.css";

/**
 * Sidebar:
 * - Logo (cuadrado semi redondo).
 * - Botones solicitados: Agregar producto, Categorías, Stock disponible.
 * - "Círculo" con información del usuario (avatar con iniciales).
 */
export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();

  const initials = (user?.name || "Usuario")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <>
      {/* Overlay para móvil */}
      <div className={`sb-overlay ${open ? "show" : ""}`} onClick={onClose} />

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sb-top">
          <div className="sb-logo">
            <img src={logo} alt="Logo" />
            <div className="sb-title">
              <div className="sb-name">Inventario</div>
              <div className="sb-sub">En la nube</div>
            </div>
          </div>

          <nav className="sb-nav">
            <NavLink to="/app/productos" className={({ isActive }) => (isActive ? "sb-link active" : "sb-link")}>
              Agregar producto
            </NavLink>
            <NavLink to="/app/categorias" className={({ isActive }) => (isActive ? "sb-link active" : "sb-link")}>
              Categorías
            </NavLink>
            <NavLink to="/app/stock" className={({ isActive }) => (isActive ? "sb-link active" : "sb-link")}>
              Stock disponible
            </NavLink>
          </nav>
        </div>

        <div className="sb-user">
          <div className="sb-avatar" title={user?.email || ""}>
            {initials || "U"}
          </div>
          <div className="sb-userinfo">
            <div className="sb-username">{user?.name || "Oscar Bahamón"}</div>
            <div className="sb-usermeta">
              <span className="badge">{user?.roleLabel || "Rol"}</span>
              <span className="muted">{user?.email || ""}</span>
            </div>
          </div>

          <button className="btn btn-ghost sb-logout" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}
