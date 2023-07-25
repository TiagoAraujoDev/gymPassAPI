import { FastifyInstance } from "fastify";
import request from "supertest";

async function createAndAuthenticateUser(app: FastifyInstance): Promise<string> {
  await request(app.server).post("/users").send({
    name: "Jonh Doe",
    email: "jonhdoe@example.com",
    password: "123456",
  });

  const _response = await request(app.server).post("/session").send({
    email: "jonhdoe@example.com",
    password: "123456",
  });

  const { token } = _response.body;

  return token;
}

export { createAndAuthenticateUser };
