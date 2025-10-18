import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const HOST = process.env.HOST || "0.0.0.0"; 
const PORT = Number(process.env.FRONTEND_PORT) || 5173;

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.use(express.static(path.join(__dirname, "public")));
app.use("/src", express.static(path.join(__dirname, "src")));

app.get("/dev/health", (_req, res) => res.json({ ok: true, service: "frontend-dev" }));

const server = app.listen(PORT, HOST, () => {
  console.log(
    `✅ Frontend dev server listening on http://${HOST === "0.0.0.0" ? "localhost" : HOST}:${PORT}`
  );
});
server.on("error", (err) => {
  console.error("❌ Server failed to start:", err.code || err.message);
  process.exit(1);
});
