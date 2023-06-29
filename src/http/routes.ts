import { FastifyInstance } from "fastify";

import { authentication } from "./controllers/authentication";
import { register } from "./controllers/register";

async function appRoutes(app: FastifyInstance) {
  app.post("/users", register);
  
  app.post("/session", authentication);
}

export { appRoutes };
