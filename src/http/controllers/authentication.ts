import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { InvalidCredentialsError } from "@/useCases/error/invalidCredentialsError";
import { makeAuthenticationUseCase } from "@/useCases/factories/makeAuthenticationUseCase";

async function authentication(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = bodySchema.parse(request.body);

  try {
    const authenticationUseCase = makeAuthenticationUseCase();
    
    await authenticationUseCase.execute({ email, password });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message });
    }

    throw err;
  }

  return reply.status(200).send();
}

export { authentication };
