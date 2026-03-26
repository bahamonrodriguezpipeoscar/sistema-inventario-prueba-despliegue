import express from "express";
import { readDB, writeDB } from "../db.js";

const router = express.Router();

/**
 * Categorías:
 * - GET /api/categories
 * - POST /api/categories
 * - PUT /api/categories/:id
 * - DELETE /api/categories/:id
 */
router.get("/", (req, res) => {
  const db = readDB();
  res.json({ categories: db.categories });
});

router.post("/", (req, res) => {
  const { name } = req.body || {};
  if (!name || !String(name).trim()) {
    return res.status(400).json({ message: "El nombre de la categoría es obligatorio." });
  }

  const db = readDB();
  const id = `cat-${Date.now()}`;
  const category = { id, name: String(name).trim() };
  db.categories.push(category);
  writeDB(db);
  res.status(201).json({ category });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body || {};
  if (!name || !String(name).trim()) {
    return res.status(400).json({ message: "El nombre de la categoría es obligatorio." });
  }

  const db = readDB();
  const idx = db.categories.findIndex((c) => c.id === id);
  if (idx === -1) return res.status(404).json({ message: "Categoría no encontrada." });

  db.categories[idx].name = String(name).trim();
  writeDB(db);
  res.json({ category: db.categories[idx] });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();

  // Regla: no borrar si hay productos asociados (coincide con el frontend).
  const used = db.products.some((p) => p.categoryId === id);
  if (used) return res.status(409).json({ message: "Categoría en uso (tiene productos asociados)." });

  const before = db.categories.length;
  db.categories = db.categories.filter((c) => c.id !== id);
  if (db.categories.length === before) return res.status(404).json({ message: "Categoría no encontrada." });

  writeDB(db);
  res.json({ ok: true });
});

export default router;
