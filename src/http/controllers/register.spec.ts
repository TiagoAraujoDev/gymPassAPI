import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";

describe("Register (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to register an user", async () => {
    const response = await request(app.server).post("/users").send({
      name: "Jonh Doe",
      email: "jonhdoe@example.com",
      password: "123456",
    });

    expect(response.statusCode).toBe(201);
  });
});
