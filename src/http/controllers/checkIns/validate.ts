import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { LateCheckInValidationError } from "@/useCases/error/lateCheckInValidationError";
import { ResourceNotFoundError } from "@/useCases/error/resourceNotFoundError";
import { makeValidateCheckInUseCase } from "@/useCases/factories/makeValidateCheckInUseCase";

async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string(),
  });

  const { checkInId } = validateCheckInParamsSchema.parse(request.body);

  const validateCheckInUseCase = makeValidateCheckInUseCase();

  try {
    await validateCheckInUseCase.execute({
      checkInId,
    });

    return reply.status(204).send();
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: "Check-in not found!" });
    } else if (err instanceof LateCheckInValidationError) {
      return reply.status(400).send({ message: "Exceed time limit!" });
    }
  }
}

export { validate };
