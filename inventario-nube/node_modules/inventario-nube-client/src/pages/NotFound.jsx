import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container" style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div className="card" style={{ padding: 20 }}>
        <div style={{ fontWeight: 1000, fontSize: 22 }}>Ruta no encontrada</div>
        <p className="muted">La página solicitada no existe.</p>
        <Link to="/login" className="btn btn-primary" style={{ textDecoration: "none" }}>
          Ir al login
        </Link>
      </div>
    </div>
  );
}
