import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/tests/createAndAuthenticateUser";

describe("Check-ins history (e2e)", () => {
  beforeAll(() => {
    app.ready();
  });

  afterAll(() => {
    app.close();
  });

  it("should be able to fetch check-ins history", async () => {
    const token = await createAndAuthenticateUser(app);

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "GymTest",
        description: "A gym for test",
        phone: "912341234",
        latitude: 1,
        longitude: 1,
      });

    const response = await request(app.server)
      .get("/check-ins/history")
      .set("Authorization", `Bearer ${token}`)
      .send();

    console.log(response.body);

    expect(response.status).toEqual(201);
  });
});
