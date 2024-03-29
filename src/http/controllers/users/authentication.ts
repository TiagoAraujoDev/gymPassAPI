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

    const { user } = await authenticationUseCase.execute({ email, password });

    const token = await reply.jwtSign(
      { role: user.role },
      { sign: { sub: user.id } },
    );

    const refreshToken = await reply.jwtSign(
      {
        role: user.role,
      },
      { sign: { sub: user.id, expiresIn: "7d" } },
    );

    return reply
      .setCookie("refreshToken", refreshToken, {
        path: "/",
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ token });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message });
    }

    throw err;
  }
}

export { authentication };
