import { v4 as uuid } from "uuid";

/**
 * Autenticación DEMO:
 * - Valida contra credenciales fijas solicitadas.
 * - Genera token simple y guarda sesión en memoria.
 * - Para producción: JWT + hash de contraseñas + refresh tokens + rate limiting.
 */
const DEMO_USER = {
  email: "oscarbahamon@gmail.com",
  password: "Oscar1234567*",
  name: "Oscar Bahamón"
};

const sessions = new Map(); // token -> user

export function login({ email, password, role }) {
  if (email !== DEMO_USER.email || password !== DEMO_USER.password) {
    return { ok: false, message: "Credenciales inválidas." };
  }

  const token = uuid();
  const user = {
    id: "u-1",
    name: DEMO_USER.name,
    email: DEMO_USER.email,
    role: role === "admin" ? "admin" : "collab",
    roleLabel: role === "admin" ? "Administrador" : "Colaborador"
  };

  sessions.set(token, user);

  return { ok: true, token, user };
}

export function getUserByToken(token) {
  if (!token) return null;
  return sessions.get(token) || null;
}
