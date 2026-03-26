import { getUserByToken } from "../auth.js";

/**
 * Middleware de autorización:
 * - Requiere header Authorization: Bearer <token>
 */
export function requireAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const user = getUserByToken(token);

  if (!user) {
    return res.status(401).json({ message: "No autorizado." });
  }

  req.user = user;
  req.token = token;
  next();
}
