import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";

describe("Profile (e2e)", () => {
  beforeAll(() => {
    app.ready();
  });

  afterAll(() => {
    app.close();
  });

  it("should be able to get the user profile", async () => {
    await request(app.server).post("/users").send({
      name: "Jonh Doe",
      email: "jonhdoe@example.com",
      password: "123456",
    });

    const _response = await request(app.server).post("/session").send({
      email: "jonhdoe@example.com",
      password: "123456",
    });

    const { token } = _response.body;

    const response = await request(app.server)
      .get("/me")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.user.password).toEqual(undefined);
    expect(response.body.user).toEqual(expect.objectContaining({
      email: "jonhdoe@example.com",
    }));
  });
});
