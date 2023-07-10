import { PrismaCheckInsRepository } from "@/repositories/prisma/prismaCheckInsRepository";

import { ValidateCheckInUseCase } from "../validateCheckIn";

function makeValidateCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const validateCheckInUseCase = new ValidateCheckInUseCase(checkInsRepository);

  return validateCheckInUseCase;
}

export { makeValidateCheckInUseCase };
