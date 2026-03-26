import express from "express";
import { readDB } from "../db.js";

const router = express.Router();

/**
 * Stock:
 * - GET /api/stock
 * Devuelve resumen de inventario.
 */
router.get("/", (req, res) => {
  const db = readDB();

  const totalUnits = db.products.reduce((acc, p) => acc + Number(p.stock || 0), 0);
  const totalValueCop = db.products.reduce((acc, p) => acc + (Number(p.stock || 0) * Number(p.priceCop || 0)), 0);

  const byCategory = db.categories.map((c) => {
    const prods = db.products.filter((p) => p.categoryId === c.id);
    return {
      categoryId: c.id,
      categoryName: c.name,
      productsCount: prods.length,
      units: prods.reduce((acc, p) => acc + Number(p.stock || 0), 0),
      valueCop: prods.reduce((acc, p) => acc + (Number(p.stock || 0) * Number(p.priceCop || 0)), 0)
    };
  }).sort((a, b) => b.productsCount - a.productsCount);

  res.json({ totalUnits, totalValueCop, byCategory });
});

export default router;
