import React, { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../api/http";
import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";
import Toast from "../components/Toast";

/**
 * CRUD de Categorías:
 * - Crea/edita/elimina categorías.
 * - Muestra cuántos productos están asociados (para evitar borrados accidentales).
 */
export default function Categories() {
  const { token } = useAuth();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [toast, setToast] = useState({ msg: "", type: "info" });

  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");

  const usage = useMemo(() => {
    const m = new Map();
    for (const c of categories) m.set(c.id, 0);
    for (const p of products) m.set(p.categoryId, (m.get(p.categoryId) || 0) + 1);
    return m;
  }, [categories, products]);

  async function load() {
    const [c, p] = await Promise.all([
      apiFetch("/api/categories", { token }),
      apiFetch("/api/products", { token })
    ]);
    setCategories(c.categories);
    setProducts(p.products);
  }

  useEffect(() => {
    load().catch((e) => setToast({ msg: e.message, type: "error" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function reset() {
    setEditingId(null);
    setName("");
  }

  async function save(e) {
    e.preventDefault();
    if (!name.trim()) return setToast({ msg: "El nombre es obligatorio.", type: "error" });

    try {
      if (editingId) {
        await apiFetch(`/api/categories/${editingId}`, { method: "PUT", body: { name }, token });
        setToast({ msg: "Categoría actualizada.", type: "info" });
      } else {
        await apiFetch("/api/categories", { method: "POST", body: { name }, token });
        setToast({ msg: "Categoría creada.", type: "info" });
      }
      await load();
      reset();
    } catch (e2) {
      setToast({ msg: e2.message, type: "error" });
    }
  }

  function edit(c) {
    setEditingId(c.id);
    setName(c.name);
  }

  async function del(id) {
    const count = usage.get(id) || 0;
    if (count > 0) {
      return setToast({ msg: "No puedes eliminar una categoría con productos asociados. Reasigna primero.", type: "error" });
    }
    if (!confirm("¿Eliminar esta categoría?")) return;

    try {
      await apiFetch(`/api/categories/${id}`, { method: "DELETE", token });
      setToast({ msg: "Categoría eliminada.", type: "info" });
      await load();
      if (editingId === id) reset();
    } catch (e) {
      setToast({ msg: e.message, type: "error" });
    }
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: "1.1fr 1.9fr", alignItems: "start" }}>
      <Card
        title={editingId ? "Editar categoría" : "Crear categoría"}
        subtitle="Gestiona las categorías del inventario."
        right={
          editingId ? (
            <button className="btn btn-ghost" type="button" onClick={reset}>
              Cancelar edición
            </button>
          ) : null
        }
      >
        <form className="grid" onSubmit={save} style={{ gap: 10 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontWeight: 900 }}>Nombre</span>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <button className="btn btn-primary" type="submit">
            {editingId ? "Guardar cambios" : "Crear categoría"}
          </button>
        </form>
      </Card>

      <div className="grid" style={{ gridTemplateColumns: "repeat(2, minmax(0,1fr))" }}>
        {categories.map((c) => (
          <Card
            key={c.id}
            title={c.name}
            subtitle={`Productos asociados: ${usage.get(c.id) || 0}`}
            right={<span className="badge">ID: {c.id.slice(0, 6)}</span>}
          >
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn btn-edit" type="button" onClick={() => edit(c)}>
                Editar
              </button>
              <button className="btn btn-delete" type="button" onClick={() => del(c.id)}>
                Eliminar
              </button>
            </div>
          </Card>
        ))}
      </div>

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
