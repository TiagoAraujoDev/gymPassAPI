import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/tests/createAndAuthenticateUser";

describe("Check-ins validate (e2e)", () => {
  beforeAll(() => {
    app.ready();
  });

  afterAll(() => {
    app.close();
  });

  it("should be able to validate a check-in", async () => {
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

    await request(app.server)
      .post(`/gyms/${gymId}/check-ins`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        latitude: -27.2092052,
        longitude: -49.6401091,
      });

    const historyResponse = await request(app.server)
      .get("/check-ins/history")
      .set("Authorization", `Bearer ${token}`)
      .send();

    const checkInId = historyResponse.body.checkIns[0].id;

    const response = await request(app.server)
      .patch(`/check-ins/${checkInId}/validate`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.status).toEqual(204);

    const checkInAfterValidate = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkInId,
      },
    });

    expect(checkInAfterValidate.validated_at).toEqual(expect.any(Date));
  });
});
