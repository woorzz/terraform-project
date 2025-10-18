import express from "express";
import routes from "./routes.js";

const app = express();
const PORT = process.env.API_PORT || 3000;

app.use(express.json());

// Routes
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`✅ API running at http://localhost:${PORT}`);
});
