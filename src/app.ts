import fastifyCookie from "@fastify/cookie";
import { fastifyJwt } from "@fastify/jwt";
import fastify from "fastify";
import { ZodError } from "zod";

import { env } from "./env";
import { checkInsRoutes } from "./http/controllers/checkIns/routes";
import { gymsRoutes } from "./http/controllers/gyms/routes";
import { usersRoutes } from "./http/controllers/users/routes";

export const app = fastify();

app.register(fastifyCookie);

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
  sign: {
    expiresIn: "10m",
  },
});

app.register(checkInsRoutes);
app.register(gymsRoutes);
app.register(usersRoutes);

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Validation error!", issues: error.format() });
  }

  if (env.NODE_ENV !== "prod") {
    console.log(error);
  } else {
    // TODO:
    // Here we should log to an external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({
    message: "Internal server error!",
    code: error.code,
    name: error.name,
    error: error.message,
  });
});
