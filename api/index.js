import express from "express";
import cors from "cors";
import routes from "./routes.js";

const app = express();
const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.API_PORT) || 3000;

app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

app.use("/", routes);

app.listen(PORT, HOST, () => {
  console.log(
    `✅ API listening on http://${HOST === "0.0.0.0" ? "localhost" : HOST}:${PORT} (CORS: *)`
  );
});
