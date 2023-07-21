import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";

describe("Authentication (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to authenticate an existen user", async () => {
    await request(app.server).post("/users").send({
      name: "Jonh Doe",
      email: "jonhdoe@example.com",
      password: "123456",
    });

    const response = await request(app.server).post("/session").send({
      email: "jonhdoe@example.com",
      password: "123456",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
  });
});
