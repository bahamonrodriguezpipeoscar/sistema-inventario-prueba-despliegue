# Sistema de Inventario en la Nube

Proyecto con:
- Cliente React + Vite.
- API Node.js + Express.
- Persistencia local en `server/src/data/db.json`.
- Login demo con roles.

## Requisitos

- Node.js 18 o superior.
- npm 9 o superior.

## Instalacion

Desde la raiz del proyecto:

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

- Cliente: `http://localhost:5173`
- API: `http://localhost:5174`

## Build

```bash
npm run build
```

Ese comando genera el build del cliente en `client/dist`.

## Produccion

Para iniciar la API:

```bash
npm start
```

Variables recomendadas:

- `PORT`: puerto del servidor Express.
- `CORS_ORIGIN`: lista separada por comas con los dominios permitidos para el frontend.
- `VITE_API_URL`: URL publica de la API. En desarrollo puede ser `http://localhost:5174`. Si frontend y backend comparten dominio, puede omitirse para usar rutas relativas.

## Despliegue

- Frontend:
  - Root directory: `client`
  - Build command: `npm run build`
  - Output directory: `dist`
- Backend:
  - Root directory: `server`
  - Start command: `npm start`
  - Configura `CORS_ORIGIN` con el dominio real del frontend.

Si despliegas ambos servicios por separado, define `VITE_API_URL` en el frontend con la URL publica del backend.
