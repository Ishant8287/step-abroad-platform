const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const Student = require("../models/Student");

beforeAll(async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/waygood-test");
});

afterAll(async () => {
  await Student.deleteMany({ email: /testuser/ });
  await mongoose.disconnect();
});

describe("Auth API", () => {
  let token;

  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      fullName: "Test User",
      email: "testuser@test.com",
      password: "Test1234!",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });

  it("should not register duplicate email", async () => {
    const res = await request(app).post("/api/auth/register").send({
      fullName: "Test User",
      email: "testuser@test.com",
      password: "Test1234!",
    });

    expect(res.statusCode).toBe(409);
  });

  it("should login with correct credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "testuser@test.com",
      password: "Test1234!",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.token).toBeDefined();
    token = res.body.data.token;
  });

  it("should reject login with wrong password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "testuser@test.com",
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
  });

  it("should return profile for authenticated user", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.email).toBe("testuser@test.com");
  });

  it("should reject /me without token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.statusCode).toBe(401);
  });
});
