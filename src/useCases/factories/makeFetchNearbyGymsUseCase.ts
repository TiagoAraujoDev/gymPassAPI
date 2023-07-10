import { PrismaGymsRepository } from "@/repositories/prisma/prismaGymsRepository";

import { FetchNearbyGymsUseCase } from "../fetchNearbyGyms";

function makeFetchNearbyGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository();
  const fetchNearbyGymsUseCase = new FetchNearbyGymsUseCase(gymsRepository);

  return fetchNearbyGymsUseCase;
}

export { makeFetchNearbyGymsUseCase };
