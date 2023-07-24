import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { makeFetchNearbyGymsUseCase } from "@/useCases/factories/makeFetchNearbyGymsUseCase";

async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const fetchNearbyGymsQuerySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { longitude, latitude } = fetchNearbyGymsQuerySchema.parse(request.query);

  const fetchNearbyGymsUseCase = makeFetchNearbyGymsUseCase();

  const { gyms } = await fetchNearbyGymsUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(200).send({
    gyms,
  });
}

export { nearby };
