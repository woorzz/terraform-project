import { jest, describe, it, expect } from "@jest/globals";
import request from "supertest";
import express from "express";

const mockedDb = {
    pingDb: jest.fn().mockResolvedValue(true),
    query: jest.fn().mockResolvedValue({ rows: [{ id: 1, message: "Hello c'est Marine!" }] }),
};
jest.unstable_mockModule("../db.js", () => mockedDb);

const routes = (await import("../routes.js")).default;

const app = express();
app.use("/", routes);

describe("API basic tests (DB mocked)", () => {
    it("GET /health returns ok", async () => {
        const res = await request(app).get("/health");
        expect(res.status).toBe(200);
        expect(res.body.ok).toBe(true);
        expect(res.body.service).toBe("api");
    });

    it("GET /api/v1/example returns message", async () => {
        const res = await request(app).get("/api/v1/example");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ id: 1, message: "Hello c'est Marine!" });
    });
});
