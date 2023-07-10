import { PrismaGymsRepository } from "@/repositories/prisma/prismaGymsRepository";

import { CreateGymUseCase } from "../createGym";

function makeCreateGymUseCase() {
  const gymsRepository = new PrismaGymsRepository();
  const createGym = new CreateGymUseCase(gymsRepository);

  return createGym;
}

export { makeCreateGymUseCase };
