import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

/**
 * Layout general del dashboard:
 * - Sidebar (fijo en desktop, off-canvas en móvil).
 * - Contenido principal.
 */
export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", minHeight: "100vh" }}>
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <main style={{ padding: 18 }}>
        <Topbar onMenu={() => setOpen(true)} />
        <div style={{ marginTop: 12 }}>
          <Outlet />
        </div>
      </main>

      {/* Ajuste responsive: en móvil eliminamos la columna fija (sidebar se vuelve overlay). */}
      <style>{`
        @media (max-width: 920px){
          div[style*="grid-template-columns: 280px 1fr"]{
            grid-template-columns: 1fr !important;
          }
          main{ padding: 12px !important; }
        }
      `}</style>
    </div>
  );
}
