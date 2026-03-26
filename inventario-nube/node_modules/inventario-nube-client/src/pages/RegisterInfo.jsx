import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import Toast from "../components/Toast";

const departmentsByCountry = {
  Colombia: ["Amazonas", "Antioquia", "Atlantico", "Bogota D.C.", "Bolivar", "Boyaca", "Caldas", "Cauca", "Cundinamarca", "Huila", "Magdalena", "Meta", "Norte de Santander", "Risaralda", "Santander", "Tolima", "Valle del Cauca"],
  Mexico: ["CDMX", "Jalisco", "Nuevo Leon", "Puebla", "Yucatan"],
  Peru: ["Arequipa", "Cusco", "La Libertad", "Lima", "Piura"]
};

const initialForm = {
  firstName: "",
  lastName: "",
  position: "",
  role: "admin",
  phone: "",
  address: "",
  country: "Colombia",
  department: "Bogota D.C."
};

export default function RegisterInfo() {
  const [form, setForm] = useState(initialForm);
  const [toast, setToast] = useState("");

  const departments = departmentsByCountry[form.country] || [];

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function onCountryChange(value) {
    const nextDepartments = departmentsByCountry[value] || [];
    setForm((current) => ({
      ...current,
      country: value,
      department: nextDepartments[0] || ""
    }));
  }

  function onSubmit(e) {
    e.preventDefault();
    setToast("Solicitud registrada en modo demo. El backend de registro aun no esta habilitado.");
  }

  return (
    <div className="container" style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "34px 0" }}>
      <div className="card" style={{ width: "min(760px, 94vw)", padding: 22 }}>
        <div style={{ display: "grid", placeItems: "center", gap: 10, marginBottom: 18 }}>
          <img
            src={logo}
            alt="Logo"
            style={{
              width: 96,
              height: 96,
              borderRadius: 24,
              display: "block",
              objectFit: "cover",
              boxShadow: "0 14px 30px rgba(10,27,34,0.14)"
            }}
          />
          <div style={{ fontWeight: 1000, fontSize: 22, textAlign: "center" }}>Crea tu solicitud de registro</div>
          <div className="muted" style={{ textAlign: "center", maxWidth: 540 }}>
            Completa la informacion para vincularte al sistema de inventario en la nube.
          </div>
        </div>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            <div style={{ display: "grid", gap: 8 }}>
              <label style={{ fontWeight: 900 }}>Nombre</label>
              <input
                className="input"
                value={form.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                placeholder="Ingresa tu nombre"
                required
              />
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <label style={{ fontWeight: 900 }}>Apellido</label>
              <input
                className="input"
                value={form.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                placeholder="Ingresa tu apellido"
                required
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            <div style={{ display: "grid", gap: 8 }}>
              <label style={{ fontWeight: 900 }}>Cargo que desempeña</label>
              <input
                className="input"
                value={form.position}
                onChange={(e) => updateField("position", e.target.value)}
                placeholder="Ej. Auxiliar de bodega"
                required
              />
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <label style={{ fontWeight: 900 }}>Telefono movil</label>
              <input
                className="input"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="3001234567"
                inputMode="tel"
                required
              />
            </div>
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            <label style={{ fontWeight: 900 }}>Rol solicitado</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <button
                type="button"
                className={`btn ${form.role === "admin" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => updateField("role", "admin")}
              >
                Administrativo
              </button>
              <button
                type="button"
                className={`btn ${form.role === "collab" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => updateField("role", "collab")}
              >
                Colaborador
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <label style={{ fontWeight: 900 }}>Direccion de residencia</label>
            <input
              className="input"
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
              placeholder="Calle 123 # 45 - 67"
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            <div style={{ display: "grid", gap: 8 }}>
              <label style={{ fontWeight: 900 }}>Pais</label>
              <select className="input" value={form.country} onChange={(e) => onCountryChange(e.target.value)}>
                {Object.keys(departmentsByCountry).map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <label style={{ fontWeight: 900 }}>Departamento</label>
              <select className="input" value={form.department} onChange={(e) => updateField("department", e.target.value)}>
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
              padding: 14,
              borderRadius: 16,
              background: "rgba(12,192,223,0.08)",
              border: "1px solid rgba(12,192,223,0.18)"
            }}
          >
            <div>
              <div style={{ fontWeight: 900, marginBottom: 4 }}>Resumen de solicitud</div>
              <div className="muted">
                {form.firstName || "Nombre"} {form.lastName || "Apellido"} como {form.role === "admin" ? "Administrativo" : "Colaborador"}.
              </div>
            </div>
            <div className="muted" style={{ alignSelf: "center" }}>
              {form.country} {form.department ? `· ${form.department}` : ""}
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between", alignItems: "center" }}>
            <div className="muted">
              Si ya tienes cuenta, <Link to="/login" style={{ fontWeight: 900, textDecoration: "underline" }}>vuelve al inicio de sesion</Link>
            </div>
            <button className="btn btn-primary" type="submit">
              Enviar solicitud
            </button>
          </div>
        </form>
      </div>

      <Toast message={toast} type="info" onClose={() => setToast("")} />
    </div>
  );
}
