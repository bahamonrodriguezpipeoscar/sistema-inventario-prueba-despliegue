import fs from "fs";
import path from "path";

/**
 * Persistencia simple en archivo JSON.
 * - Lee y escribe en server/src/data/db.json
 * - Para un entorno real, se recomienda base de datos (PostgreSQL/MySQL) + ORM.
 */
const DB_PATH = path.join(process.cwd(), "src", "data", "db.json");

export function readDB() {
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

export function writeDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}
