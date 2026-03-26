/**
 * Cliente HTTP simple para consumir la API.
 * - Adjunta el token (si existe) en Authorization.
 * - Maneja errores de forma uniforme.
 */
const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export async function apiFetch(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
  } catch {
    const target = `${API_URL}${path}` || path;
    throw new Error(`No se pudo conectar con la API (${target}). Verifica que el backend este ejecutandose.`);
  }

  // Intentamos leer JSON aunque sea error (para mostrar mensaje).
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data?.message || "Error al comunicar con la API.";
    throw new Error(msg);
  }

  return data;
}
