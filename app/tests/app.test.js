const request = require("supertest");
const app = require("../src/app");

describe("GET /", () => {
  it("should return status success with app info", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("DevOps Pipeline App is running");
    expect(res.body).toHaveProperty("version");
    expect(res.body).toHaveProperty("timestamp");
  });
});

describe("GET /health", () => {
  it("should return healthy status", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("healthy");
    expect(res.body).toHaveProperty("uptime");
    expect(res.body).toHaveProperty("timestamp");
  });
});

describe("GET /info", () => {
  it("should return application metadata", async () => {
    const res = await request(app).get("/info");
    expect(res.statusCode).toBe(200);
    expect(res.body.app).toBe("devops-pipeline-app");
    expect(res.body).toHaveProperty("node");
    expect(res.body).toHaveProperty("platform");
  });
});

describe("GET /unknown-route", () => {
  it("should return 404 for undefined routes", async () => {
    const res = await request(app).get("/unknown-route");
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("Route not found");
  });
});
