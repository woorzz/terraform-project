import { Router } from "express";
import { pingDb, query } from "./db.js";

const router = Router();

router.get("/health", async (_req, res) => {
    try {
        const dbOk = await pingDb();
        res.json({ ok: true, service: "api", db: dbOk });
    } catch (e) {
        res.status(500).json({ ok: false, error: String(e) });
    }
});

router.get("/v1/example", async (_req, res) => {
    const result = await query("SELECT id, message FROM example ORDER BY id ASC LIMIT 1");
    res.json(result.rows[0] || { id: null, message: "No data" });
});

export default router;
