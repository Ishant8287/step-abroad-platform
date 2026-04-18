const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const env = require("../config/env");
const Student = require("../models/Student");

jest.setTimeout(30000);

beforeAll(async () => {
  await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 20000,
  });
});

afterAll(async () => {
  await Student.deleteMany({ email: /testuser/ });
  await mongoose.disconnect();
});

const runId = Math.random().toString(36).substring(7);
const testEmail = `testuser-${runId}@test.com`;

describe("Auth API", () => {
  let token;

  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      fullName: "Test User",
      email: testEmail,
      password: "Test1234!",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });

  it("should not register duplicate email", async () => {
    const res = await request(app).post("/api/auth/register").send({
      fullName: "Test User",
      email: testEmail,
      password: "Test1234!",
    });

    expect(res.statusCode).toBe(409);
  });

  it("should login with correct credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testEmail,
      password: "Test1234!",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.token).toBeDefined();
    token = res.body.data.token;
  });

  it("should reject login with wrong password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testEmail,
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
  });

  it("should return profile for authenticated user", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.email).toBe(testEmail);
  });

  it("should forbid dashboard overview for student user", async () => {
    const res = await request(app)
      .get("/api/dashboard/overview")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
  });

  it("should return programs for authenticated user", async () => {
    const res = await request(app)
      .get("/api/programs")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should reject /me without token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.statusCode).toBe(401);
  });

  it("should reject dashboard overview without token", async () => {
    const res = await request(app).get("/api/dashboard/overview");
    expect(res.statusCode).toBe(401);
  });

  it("should reject programs without token", async () => {
    const res = await request(app).get("/api/programs");
    expect(res.statusCode).toBe(401);
  });
});
