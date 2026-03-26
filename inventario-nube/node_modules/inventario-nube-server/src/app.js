import express from "express";
import cors from "cors";
import { login } from "./auth.js";
import { requireAuth } from "./middleware/authMiddleware.js";

import productsRouter from "./routes/products.js";
import categoriesRouter from "./routes/categories.js";
import stockRouter from "./routes/stock.js";

const app = express();

const defaultOrigins = ["http://localhost:5173"];
const configuredOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = configuredOrigins.length > 0 ? configuredOrigins : defaultOrigins;

function isLocalOrigin(origin) {
  try {
    const { hostname } = new URL(origin);
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1" || hostname === "[::1]";
  } catch {
    return false;
  }
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || origin === "null" || allowedOrigins.includes(origin) || isLocalOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origen no permitido por CORS"));
    },
    credentials: true
  })
);
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

app.post("/api/auth/login", (req, res) => {
  const { email, password, role } = req.body || {};
  const out = login({ email, password, role });

  if (!out.ok) return res.status(401).json({ message: out.message });
  res.json({ token: out.token, user: out.user });
});

app.get("/api/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// Montar routers (si quieres protegerlos con token)
app.use("/api/products", requireAuth, productsRouter);
app.use("/api/categories", requireAuth, categoriesRouter);
app.use("/api/stock", requireAuth, stockRouter);

export default app;
