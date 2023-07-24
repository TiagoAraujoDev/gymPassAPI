import { FastifyInstance } from "fastify";

import { verifyJWT } from "@/http/middlewares/verifyJWT";

import { authentication } from "./authentication";
import { profile } from "./profile";
import { register } from "./register";

async function usersRoutes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/session", authentication);

  /* Authenticated */
  app.get("/me", { onRequest: [verifyJWT] }, profile);
}

export { usersRoutes };
