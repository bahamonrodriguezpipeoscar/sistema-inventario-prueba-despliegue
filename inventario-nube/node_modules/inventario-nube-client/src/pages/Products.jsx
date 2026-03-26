import React, { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../api/http";
import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";
import Toast from "../components/Toast";

/**
 * CRUD de Productos:
 * - Crear, editar, eliminar.
 * - Responsive: form y lista se apilan en pantallas pequeñas.
 */
export default function Products() {
  const { token } = useAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [toast, setToast] = useState({ msg: "", type: "info" });

  // Formulario
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    brand: "",
    sku: "",
    categoryId: "",
    priceCop: 0,
    stock: 0
  });

  const isEditing = Boolean(editingId);

  const catMap = useMemo(() => {
    const m = new Map();
    for (const c of categories) m.set(c.id, c);
    return m;
  }, [categories]);

  async function load() {
    const [p, c] = await Promise.all([
      apiFetch("/api/products", { token }),
      apiFetch("/api/categories", { token })
    ]);
    setProducts(p.products);
    setCategories(c.categories);
  }

  useEffect(() => {
    load().catch((e) => setToast({ msg: e.message, type: "error" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetForm() {
    setEditingId(null);
    setForm({
      name: "",
      brand: "",
      sku: "",
      categoryId: categories[0]?.id || "",
      priceCop: 0,
      stock: 0
    });
  }

  async function onCreateOrUpdate(e) {
    e.preventDefault();

    // Validación básica,  el backend también valida.
    if (!form.name.trim()) return setToast({ msg: "El nombre del producto es obligatorio.", type: "error" });
    if (!form.categoryId) return setToast({ msg: "Selecciona una categoría.", type: "error" });
    if (Number(form.priceCop) < 0) return setToast({ msg: "El precio no puede ser negativo.", type: "error" });
    if (Number(form.stock) < 0) return setToast({ msg: "El stock no puede ser negativo.", type: "error" });

    try {
      if (isEditing) {
        await apiFetch(`/api/products/${editingId}`, { method: "PUT", body: form, token });
        setToast({ msg: "Producto actualizado.", type: "info" });
      } else {
        await apiFetch("/api/products", { method: "POST", body: form, token });
        setToast({ msg: "Producto creado.", type: "info" });
      }
      await load();
      resetForm();
    } catch (e2) {
      setToast({ msg: e2.message, type: "error" });
    }
  }

  function onEdit(p) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      brand: p.brand,
      sku: p.sku,
      categoryId: p.categoryId,
      priceCop: p.priceCop,
      stock: p.stock
    });
  }

  async function onDelete(id) {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      await apiFetch(`/api/products/${id}`, { method: "DELETE", token });
      setToast({ msg: "Producto eliminado.", type: "info" });
      await load();
      // Si estabas editando el que borraste, limpiamos el form.
      if (editingId === id) resetForm();
    } catch (e) {
      setToast({ msg: e.message, type: "error" });
    }
  }

  // Formato COP 
  const fmtCop = (n) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(Number(n || 0));

  return (
    <div className="grid" style={{ gridTemplateColumns: "1.1fr 1.9fr", alignItems: "start" }}>
      <Card
        title={isEditing ? "Editar producto" : "Agregar producto"}
        subtitle="Crea, edita y elimina productos."
        right={
          isEditing ? (
            <button className="btn btn-ghost" type="button" onClick={resetForm}>
              Cancelar edición
            </button>
          ) : null
        }
      >
        <form className="grid" onSubmit={onCreateOrUpdate} style={{ gridTemplateColumns: "1fr", gap: 10 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontWeight: 900 }}>Nombre</span>
            <input className="input" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
          </label>

          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontWeight: 900 }}>Marca</span>
              <input className="input" value={form.brand} onChange={(e) => setForm((s) => ({ ...s, brand: e.target.value }))} />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontWeight: 900 }}>SKU</span>
              <input className="input" value={form.sku} onChange={(e) => setForm((s) => ({ ...s, sku: e.target.value }))} />
            </label>
          </div>

          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontWeight: 900 }}>Categoría</span>
            <select className="input" value={form.categoryId} onChange={(e) => setForm((s) => ({ ...s, categoryId: e.target.value }))}>
              <option value="" disabled>
                Selecciona una categoría
              </option>
              {categories.map((c) => (
                <option value={c.id} key={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontWeight: 900 }}>Precio (COP)</span>
              <input
                className="input"
                type="number"
                min="0"
                value={form.priceCop}
                onChange={(e) => setForm((s) => ({ ...s, priceCop: Number(e.target.value) }))}
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontWeight: 900 }}>Stock</span>
              <input
                className="input"
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm((s) => ({ ...s, stock: Number(e.target.value) }))}
              />
            </label>
          </div>

          <button className="btn btn-primary" type="submit">
            {isEditing ? "Guardar cambios" : "Crear producto"}
          </button>
        </form>
      </Card>

      <div className="grid" style={{ gridTemplateColumns: "repeat(2, minmax(0,1fr))" }}>
        {products.map((p) => (
          <Card
            key={p.id}
            title={p.name}
            subtitle={`${catMap.get(p.categoryId)?.name || "Sin categoría"} • ${p.brand || "Marca N/A"} • SKU: ${p.sku || "N/A"}`}
            right={<span className="badge">Stock: {p.stock}</span>}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 1000, fontSize: 18 }}>{fmtCop(p.priceCop)}</div>
                <div className="muted" style={{ fontSize: 12 }}>
                  Valor total (precio × stock): {fmtCop(Number(p.priceCop) * Number(p.stock))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-edit" onClick={() => onEdit(p)} type="button">
                  Editar
                </button>
                <button className="btn btn-delete" onClick={() => onDelete(p.id)} type="button">
                  Eliminar
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Responsive: pasamos a 1 columna en móvil */}
      <style>{`
        @media (max-width: 980px){
          div[style*="grid-template-columns: 1.1fr 1.9fr"]{ grid-template-columns: 1fr !important; }
        }
        @media (max-width: 720px){
          div[style*="repeat(2"]{ grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Toast message={toast.msg} type={toast.type} onClose={() => setToast({ msg: "", type: "info" })} />
    </div>
  );
}
