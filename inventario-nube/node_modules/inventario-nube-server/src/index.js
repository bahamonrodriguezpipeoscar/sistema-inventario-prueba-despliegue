import app from "./app.js";

const PORT = process.env.PORT || 5174;

app.listen(PORT, () => {
  console.log(`API en http://localhost:${PORT}`);
});