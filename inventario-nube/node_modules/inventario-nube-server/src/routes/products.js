import express from "express";
import { readDB, writeDB } from "../db.js";

const router = express.Router();

/**
 * Productos:
 * - GET /api/products
 * - POST /api/products
 * - PUT /api/products/:id
 * - DELETE /api/products/:id
 */
router.get("/", (req, res) => {
  const db = readDB();
  res.json({ products: db.products });
});

router.post("/", (req, res) => {
  const { name, brand, sku, categoryId, priceCop, stock } = req.body || {};

  if (!name || !String(name).trim()) return res.status(400).json({ message: "El nombre del producto es obligatorio." });
  if (!categoryId) return res.status(400).json({ message: "La categoría es obligatoria." });

  const db = readDB();
  const catExists = db.categories.some((c) => c.id === categoryId);
  if (!catExists) return res.status(400).json({ message: "La categoría no existe." });

  const p = {
    id: `p-${Date.now()}`,
    name: String(name).trim(),
    brand: String(brand || "").trim(),
    sku: String(sku || "").trim(),
    categoryId,
    priceCop: Number(priceCop || 0),
    stock: Number(stock || 0)
  };

  if (p.priceCop < 0) return res.status(400).json({ message: "El precio no puede ser negativo." });
  if (p.stock < 0) return res.status(400).json({ message: "El stock no puede ser negativo." });

  db.products.push(p);
  writeDB(db);
  res.status(201).json({ product: p });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, brand, sku, categoryId, priceCop, stock } = req.body || {};

  const db = readDB();
  const idx = db.products.findIndex((p) => p.id === id);
  if (idx === -1) return res.status(404).json({ message: "Producto no encontrado." });

  if (!name || !String(name).trim()) return res.status(400).json({ message: "El nombre del producto es obligatorio." });
  if (!categoryId) return res.status(400).json({ message: "La categoría es obligatoria." });

  const catExists = db.categories.some((c) => c.id === categoryId);
  if (!catExists) return res.status(400).json({ message: "La categoría no existe." });

  const next = {
    ...db.products[idx],
    name: String(name).trim(),
    brand: String(brand || "").trim(),
    sku: String(sku || "").trim(),
    categoryId,
    priceCop: Number(priceCop || 0),
    stock: Number(stock || 0)
  };

  if (next.priceCop < 0) return res.status(400).json({ message: "El precio no puede ser negativo." });
  if (next.stock < 0) return res.status(400).json({ message: "El stock no puede ser negativo." });

  db.products[idx] = next;
  writeDB(db);
  res.json({ product: next });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const before = db.products.length;
  db.products = db.products.filter((p) => p.id !== id);
  if (db.products.length === before) return res.status(404).json({ message: "Producto no encontrado." });

  writeDB(db);
  res.json({ ok: true });
});

export default router;
