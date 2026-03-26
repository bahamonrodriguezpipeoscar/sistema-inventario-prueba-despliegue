import React from "react";

/**
 * Card reutilizable para mostrar información de productos/estadísticas.
 */
export default function Card({ title, subtitle, children, right }) {
  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 14 }}>{title}</div>
          {subtitle ? <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>{subtitle}</div> : null}
        </div>
        {right}
      </div>
      <div style={{ marginTop: 12 }}>{children}</div>
    </div>
  );
}
