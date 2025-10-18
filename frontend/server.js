import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.FRONTEND_PORT) || 5173;

const FRONTEND_API_BASE_URL = process.env.FRONTEND_API_BASE_URL || "http://localhost:3000";

app.use((_, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.get("/dev/config.json", (_req, res) => {
  res.json({ apiBaseUrl: FRONTEND_API_BASE_URL });
});

app.use(express.static(path.join(__dirname, "public")));
app.use("/src", express.static(path.join(__dirname, "src")));

app.get("/dev/health", (_req, res) =>
  res.json({ ok: true, service: "frontend-dev", apiBaseUrl: FRONTEND_API_BASE_URL })
);

app.listen(PORT, HOST, () => {
  console.log(
    `✅ Frontend dev server listening on http://localhost:${PORT} (API=${FRONTEND_API_BASE_URL})`
  );
});
