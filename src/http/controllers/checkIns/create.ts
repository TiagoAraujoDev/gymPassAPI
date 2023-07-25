import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { MaxDistanceError } from "@/useCases/error/maxDistanceError";
import { MaxNumberOfCheckInsError } from "@/useCases/error/maxNumberOfCheckInsError";
import { ResourceNotFoundError } from "@/useCases/error/resourceNotFoundError";
import { makeCheckInUseCase } from "@/useCases/factories/makeCheckInUseCase";

async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  });

  const createCheckInBodySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { latitude, longitude } = createCheckInBodySchema.parse(request.body);
  const { gymId } = createCheckInParamsSchema.parse(request.params);
  const userId = request.user.sub;

  const checkInUseCase = makeCheckInUseCase();

  try {
    const { checkIn } = await checkInUseCase.execute({
      userId,
      gymId,
      userLatitude: latitude,
      userLongitude: longitude,
    });

    return reply.status(201).send({
      checkIn,
    });
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: "Gym not found!" });
    } else if (err instanceof MaxDistanceError) {
      return reply.status(400).send({ message: "Gym out of range!" });
    } else if (err instanceof MaxNumberOfCheckInsError) {
      return reply
        .status(400)
        .send({ message: "You exceed the number of check-ins!" });
    }
  }
}

export { create };
