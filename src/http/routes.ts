import { FastifyInstance } from "fastify";

import { authentication } from "./controllers/authentication";
import { profile } from "./controllers/profile";
import { register } from "./controllers/register";
import { verifyJWT } from "./middlewares/verifyJWT";

async function appRoutes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/session", authentication);

  /* Authenticated */
  app.get("/me", { onRequest: [verifyJWT] }, profile);
}

export { appRoutes };
