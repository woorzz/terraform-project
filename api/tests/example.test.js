import request from "supertest";
import express from "express";
import routes from "../routes.js";

const app = express();
app.use("/", routes);

describe("API basic tests", () => {
    it("GET /health returns ok", async () => {
        const res = await request(app).get("/health");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ ok: true, service: "api" });
    });

    it("GET /api/v1/example returns message", async () => {
        const res = await request(app).get("/api/v1/example");
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Hello Marine!");
    });
});
