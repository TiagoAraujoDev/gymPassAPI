import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/tests/createAndAuthenticateUser";

describe("Check-ins history (e2e)", () => {
  beforeAll(() => {
    app.ready();
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
    app.close();
  });

  it("should be able to list check-ins history", async () => {
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

    const gymsNearbyResponse = await request(app.server)
      .get("/gyms/nearby")
      .set("Authorization", `Bearer ${token}`)
      .query({
        latitude: -27.2092052,
        longitude: -49.6401091,
      })
      .send();

    const gymId = gymsNearbyResponse.body.gyms[0].id;

    vi.setSystemTime(new Date(2023, 0, 24, 10, 30, 0));
    await request(app.server)
      .post(`/gyms/${gymId}/check-ins`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        latitude: -27.2092052,
        longitude: -49.6401091,
      });

    vi.setSystemTime(new Date(2023, 0, 25, 10, 30, 0));
    await request(app.server)
      .post(`/gyms/${gymId}/check-ins`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        latitude: -27.2092052,
        longitude: -49.6401091,
      });

    const response = await request(app.server)
      .get("/check-ins/history")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.checkIns).toHaveLength(2);
    expect(response.body.checkIns).toEqual([
      expect.objectContaining({
        gym_id: gymId,
      }),
      expect.objectContaining({
        gym_id: gymId,
      }),
    ]);
  });
});
