import {expect, test} from "bun:test";
import request from "supertest";
import {createApp} from "../src/app";

test("GET /api/v1/health -> 200", async () => {
  const app = createApp();
  const res = await request(app).get("/api/v1/health");
  expect(res.status).toBe(200);
  expect(res.body.success).toBe(true);
});
