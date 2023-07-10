import { PrismaCheckInsRepository } from "@/repositories/prisma/prismaCheckInsRepository";

import { GetUserMetricsUseCase } from "../getUserMetrics";

function makeGetUserMetricsUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const getUserMetricsUseCase = new GetUserMetricsUseCase(checkInsRepository);

  return getUserMetricsUseCase;
}

export { makeGetUserMetricsUseCase };
