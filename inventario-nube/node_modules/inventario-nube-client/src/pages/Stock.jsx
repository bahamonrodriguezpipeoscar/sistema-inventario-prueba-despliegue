import React, { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../api/http";
import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";
import Toast from "../components/Toast";

/**
 * Stock:
 * - Resumen: total de unidades, valor total estimado, top categorías.
 * - Tabla por producto.
 */
export default function Stock() {
  const { token } = useAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState(null);

  const [toast, setToast] = useState({ msg: "", type: "info" });

  const catMap = useMemo(() => {
    const m = new Map();
    for (const c of categories) m.set(c.id, c.name);
    return m;
  }, [categories]);

  async function load() {
    const [p, c, s] = await Promise.all([
      apiFetch("/api/products", { token }),
      apiFetch("/api/categories", { token }),
      apiFetch("/api/stock", { token })
    ]);
    setProducts(p.products);
    setCategories(c.categories);
    setSummary(s);
  }

  useEffect(() => {
    load().catch((e) => setToast({ msg: e.message, type: "error" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fmtCop = (n) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(Number(n || 0));

  return (
    <div className="grid" style={{ gap: 14 }}>
      <div className="grid" style={{ gridTemplateColumns: "repeat(3, minmax(0,1fr))" }}>
        <Card title="Unidades totales" subtitle="Suma del stock de todos los productos.">
          <div style={{ fontWeight: 1000, fontSize: 28 }}>{summary?.totalUnits ?? "—"}</div>
        </Card>

        <Card title="Valor total estimado" subtitle="Suma de (precio × stock).">
          <div style={{ fontWeight: 1000, fontSize: 28 }}>{summary ? fmtCop(summary.totalValueCop) : "—"}</div>
        </Card>

        <Card title="Categorías" subtitle="Cantidad de productos por categoría.">
          <div style={{ display: "grid", gap: 8 }}>
            {(summary?.byCategory || []).slice(0, 4).map((x) => (
              <div key={x.categoryId} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span style={{ fontWeight: 900 }}>{x.categoryName}</span>
                <span className="badge">{x.productsCount} productos</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Detalle por producto" subtitle="Listado con stock y categoría.">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
            <thead>
              <tr style={{ textAlign: "left" }}>
                {["Producto", "Categoría", "SKU", "Precio", "Stock", "Total"].map((h) => (
                  <th key={h} style={{ padding: "10px 8px", borderBottom: "1px solid rgba(10,27,34,0.12)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td style={{ padding: "10px 8px", borderBottom: "1px solid rgba(10,27,34,0.08)", fontWeight: 900 }}>
                    {p.name}
                  </td>
                  <td style={{ padding: "10px 8px", borderBottom: "1px solid rgba(10,27,34,0.08)" }}>
                    {catMap.get(p.categoryId) || "Sin categoría"}
                  </td>
                  <td style={{ padding: "10px 8px", borderBottom: "1px solid rgba(10,27,34,0.08)" }}>
                    {p.sku || "—"}
                  </td>
                  <td style={{ padding: "10px 8px", borderBottom: "1px solid rgba(10,27,34,0.08)" }}>
                    {fmtCop(p.priceCop)}
                  </td>
                  <td style={{ padding: "10px 8px", borderBottom: "1px solid rgba(10,27,34,0.08)" }}>
                    <span className="badge">{p.stock}</span>
                  </td>
                  <td style={{ padding: "10px 8px", borderBottom: "1px solid rgba(10,27,34,0.08)" }}>
                    {fmtCop(Number(p.priceCop) * Number(p.stock))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <style>{`
        @media (max-width: 920px){
          div[style*="repeat(3"]{ grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Toast message={toast.msg} type={toast.type} onClose={() => setToast({ msg: "", type: "info" })} />
    </div>
  );
}
