import { FastifyReply, FastifyRequest } from "fastify";

import { makeGetUserProfileUseCase } from "@/useCases/factories/makeGetUserProfileUseCase";

async function profile(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub;

  const getProfileUseCase = makeGetUserProfileUseCase();

  const { user: userResponse } = await getProfileUseCase.execute({
    userId,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password_hash, ...user } = userResponse;

  return reply.status(200).send({
    user,
  });
}

export { profile };
