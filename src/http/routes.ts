import { FastifyInstance } from "fastify";

import { register } from "./controllers/register";
import { authentication } from "./controllers/authentication";

async function appRoutes(app: FastifyInstance) {
  app.post("/users", register);
  
  app.post("/session", authentication);
}

export { appRoutes };
