import app from "../src/app.js";

let server;
let baseUrl;

beforeAll(() => {
  server = app.listen(0); // puerto libre automático
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

afterAll((done) => {
  server.close(done);
});

test("GET /health -> 200 y {ok:true}", async () => {
  const res = await fetch(`${baseUrl}/health`);
  expect(res.status).toBe(200);
  const body = await res.json();
  expect(body).toEqual({ ok: true });
});