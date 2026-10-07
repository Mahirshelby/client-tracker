import { describe, it, expect, afterAll } from "vitest";
import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/db";

const email = `test-${Date.now()}@example.com`;
const password = "password123";
let token = "";
let clientId = 0;
let taskId = 0;

const auth = () => ({ Authorization: `Bearer ${token}` });

afterAll(async () => {
  // Deleting the user cascades to their clients and tasks
  await prisma.user.deleteMany({ where: { email } });
  await prisma.$disconnect();
});

describe("auth", () => {
  it("rejects invalid registration input", async () => {
    const res = await request(app).post("/auth/register").send({ email: "bad", password: "123" });
    expect(res.status).toBe(400);
  });

  it("registers a user", async () => {
    const res = await request(app).post("/auth/register").send({ email, password });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeTruthy();
  });

  it("rejects a duplicate email", async () => {
    const res = await request(app).post("/auth/register").send({ email, password });
    expect(res.status).toBe(409);
  });

  it("logs in and returns a token", async () => {
    const res = await request(app).post("/auth/login").send({ email, password });
    expect(res.status).toBe(200);
    token = res.body.token;
    expect(token).toBeTruthy();
  });

  it("rejects a wrong password", async () => {
    const res = await request(app).post("/auth/login").send({ email, password: "wrongpassword" });
    expect(res.status).toBe(401);
  });

  it("blocks /auth/me without a token", async () => {
    const res = await request(app).get("/auth/me");
    expect(res.status).toBe(401);
  });

  it("returns the user on /auth/me", async () => {
    const res = await request(app).get("/auth/me").set(auth());
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(email);
  });
});

describe("clients", () => {
  it("requires auth", async () => {
    const res = await request(app).get("/clients");
    expect(res.status).toBe(401);
  });

  it("validates input", async () => {
    const res = await request(app).post("/clients").set(auth()).send({ name: "" });
    expect(res.status).toBe(400);
  });

  it("creates a client", async () => {
    const res = await request(app)
      .post("/clients")
      .set(auth())
      .send({ name: "Acme Corp", company: "Acme", tags: ["lead"] });
    expect(res.status).toBe(201);
    clientId = res.body.id;
    expect(clientId).toBeGreaterThan(0);
  });

  it("searches with pagination", async () => {
    const res = await request(app).get("/clients?search=acme&page=1&limit=5").set(auth());
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(1);
    expect(res.body.items[0].name).toBe("Acme Corp");
  });

  it("returns an empty list for a search with no match", async () => {
    const res = await request(app).get("/clients?search=zzzz").set(auth());
    expect(res.body.total).toBe(0);
  });

  it("updates a client", async () => {
    const res = await request(app).put(`/clients/${clientId}`).set(auth()).send({ company: "Acme Inc" });
    expect(res.status).toBe(200);
    expect(res.body.company).toBe("Acme Inc");
  });
});

describe("tasks", () => {
  it("creates a task for a client", async () => {
    const res = await request(app)
      .post(`/clients/${clientId}/tasks`)
      .set(auth())
      .send({ title: "Send proposal", dueDate: "2026-10-20" });
    expect(res.status).toBe(201);
    expect(res.body.done).toBe(false);
    taskId = res.body.id;
  });

  it("lists tasks for the client", async () => {
    const res = await request(app).get(`/clients/${clientId}/tasks`).set(auth());
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it("marks a task done", async () => {
    const res = await request(app).put(`/tasks/${taskId}`).set(auth()).send({ done: true });
    expect(res.status).toBe(200);
    expect(res.body.done).toBe(true);
  });

  it("returns 404 for tasks of a missing client", async () => {
    const res = await request(app).get("/clients/999999/tasks").set(auth());
    expect(res.status).toBe(404);
  });

  it("deletes a task", async () => {
    const res = await request(app).delete(`/tasks/${taskId}`).set(auth());
    expect(res.status).toBe(204);
  });
});

describe("client deletion", () => {
  it("deletes a client", async () => {
    const res = await request(app).delete(`/clients/${clientId}`).set(auth());
    expect(res.status).toBe(204);
  });

  it("returns 404 for a deleted client", async () => {
    const res = await request(app).get(`/clients/${clientId}`).set(auth());
    expect(res.status).toBe(404);
  });
});
