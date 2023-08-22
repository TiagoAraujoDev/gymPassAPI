import { FastifyInstance } from "fastify";

import { verifyUserRole } from "@/http/middlewares/onlyAdmin";
import { verifyJWT } from "@/http/middlewares/verifyJWT";

import { create } from "./create";
import { history } from "./history";
import { metrics } from "./metrics";
import { validate } from "./validate";

async function checkInsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/check-ins/history", history);
  app.get("/check-ins/metrics", metrics);

  app.post("/gyms/:gymId/check-ins", create);
  app.patch(
    "/check-ins/:checkInId/validate",
    { onRequest: [verifyUserRole("ADMIN")] },
    validate,
  );
}

export { checkInsRoutes };
