import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/tests/createAndAuthenticateUser";

describe("Fetch nearby gyms (e2e)", () => {
  beforeAll(() => {
    app.ready();
  });

  afterAll(() => {
    app.close();
  });
  
  it("should be able to fetch nearby gyms", async () => {
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
      .get("/gyms/nearby")
      .set("Authorization", `Bearer ${token}`)
      .query({
        latitude: 1,
        longitude: 1,
      })
      .send();

    console.log(response.body.issues);

    expect(response.status).toEqual(200);
  });
});
