import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/tests/createAndAuthenticateUser";

describe("CheckIns (e2e)", () => {
  beforeAll(() => {
    app.ready();
  });

  afterAll(() => {
    app.close();
  });

  it("should be able to check in", async () => {
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

    const _response = await request(app.server)
      .get("/gyms/search")
      .set("Authorization", `Bearer ${token}`)
      .query({
        query: "GymTest",
      })
      .send();

    const gymId = _response.body.gyms[0].id;
    
    
    // BUG: Route note found - 404
    const response = await request(app.server)
      .post(`/gyms/${gymId}/check-ins`) // "/gyms/:gymId/check-ins"
      .set("Authorization", `Bearer ${token}`)
      .send({
        latitude: 1,
        longitude: 1,
      });

    console.log(response.body);
    
    expect(response.status).toEqual(201);
  });
});
