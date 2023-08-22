import { hash } from "bcryptjs";
import { FastifyInstance } from "fastify";
import request from "supertest";

import { prisma } from "@/lib/prisma";

async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
): Promise<string> {
  await prisma.user.create({
    data: {
      name: "Jonh Doe",
      email: "jonhdoe@example.com",
      password_hash: await hash("123456", 6),
      role: isAdmin ? "ADMIN" : "MEMBER",
    },
  });
  
  const _response = await request(app.server).post("/session").send({
    email: "jonhdoe@example.com",
    password: "123456",
  });

  const { token } = _response.body;

  return token;
}

export { createAndAuthenticateUser };
