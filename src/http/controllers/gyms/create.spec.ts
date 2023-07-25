import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/tests/createAndAuthenticateUser";

describe("Create gyms (e2e)", () => {
  beforeAll(() => {
    app.ready();
  });

  afterAll(() => {
    app.close();
  });
  
  it("should be able to create a gym", async () => {
    const token = await createAndAuthenticateUser(app);

    const response = await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "GymTest",
        description: "A gym for test",
        phone: "912341234",
        latitude: 1,
        longitude: 1,
      });

    expect(response.status).toEqual(201);
  });
});
