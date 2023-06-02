import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { RegisterUseCase } from "@/useCases/register";
import { PrismaUsersRepository } from "@/repositories/prisma/prismaUsersRepository";

async function register(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
  });

  const { name, email, password } = bodySchema.parse(request.body);

  try {
    const usersRepository = new PrismaUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    await registerUseCase.execute({ name, email, password});
  } catch (err) {
    return reply.status(409).send();
  }

  return reply.status(201).send();
}

export { register };
