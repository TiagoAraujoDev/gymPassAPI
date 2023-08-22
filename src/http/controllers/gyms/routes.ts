import { FastifyInstance } from "fastify";

import { verifyUserRole } from "@/http/middlewares/onlyAdmin";
import { verifyJWT } from "@/http/middlewares/verifyJWT";

import { create } from "./create";
import { nearby } from "./nearby";
import { search } from "./search";

async function gymsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/gyms/search", search);
  app.get("/gyms/nearby", nearby);

  app.post("/gyms", { onRequest: [verifyUserRole("ADMIN")] }, create);
}

export { gymsRoutes };
