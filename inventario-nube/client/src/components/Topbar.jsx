import React from "react";
import logo from "../assets/logo.png";
import "./topbar.css";

/**
 * Barra superior para móvil:
 * - Botón de menú (hamburguesa) para abrir/cerrar sidebar.
 * - Logo mini.
 */
export default function Topbar({ onMenu }) {
  return (
    <div className="topbar">
      <button className="btn btn-ghost topbar-menu" onClick={onMenu} aria-label="Abrir menú">
        ☰
      </button>
      <div className="topbar-brand">
        <img src={logo} alt="Logo" />
        <span>Inventario</span>
      </div>
    </div>
  );
}
