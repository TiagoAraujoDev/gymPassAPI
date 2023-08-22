import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/tests/createAndAuthenticateUser";

describe("Create check-in (e2e)", () => {
  beforeAll(() => {
    app.ready();
  });

  afterAll(() => {
    app.close();
  });

  it("should be able to create a check-in", async () => {
    const token = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test title",
        description: "Some description for test",
        phone: "912341234",
        latitude: -27.2092052,
        longitude: -49.6401091,
      });

    const searchResponse = await request(app.server)
      .get("/gyms/search")
      .set("Authorization", `Bearer ${token}`)
      .query({
        query: "Test title",
      })
      .send();

    const gymId = searchResponse.body.gyms[0].id;

    const response = await request(app.server)
      .post(`/gyms/${gymId}/check-ins`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        latitude: -27.2092052,
        longitude: -49.6401091,
      });

    expect(response.status).toEqual(201);
    expect(response.body.checkIn).toEqual(
      expect.objectContaining({
        gym_id: gymId,
      }),
    );
  });
});
