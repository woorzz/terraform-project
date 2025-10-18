import { Router } from "express";

const router = Router();

router.get("/health", (_req, res) => {
    res.json({ ok: true, service: "api" });
});

router.get("/api/v1/example", (_req, res) => {
    res.json({ message: "Hello Marine!" });
});

export default router;
