import { PrismaCheckInsRepository } from "@/repositories/prisma/prismaCheckInsRepository";
import { PrismaGymsRepository } from "@/repositories/prisma/prismaGymsRepository";

import { CheckInUseCase } from "../checkIn";

function makeCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const gymsRepository = new PrismaGymsRepository();
  const checkInUseCase = new CheckInUseCase(checkInsRepository, gymsRepository);

  return checkInUseCase;
}

export { makeCheckInUseCase };
