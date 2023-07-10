import { PrismaCheckInsRepository } from "@/repositories/prisma/prismaCheckInsRepository";

import { FetchUserCheckInsHistoryUseCase } from "../fetchUserCheckInsHistory";

function makeFetchUserCheckInsHistoryUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const fetchUserCheckInsHistoryUseCase = new FetchUserCheckInsHistoryUseCase(
    checkInsRepository,
  );

  return fetchUserCheckInsHistoryUseCase;
}

export { makeFetchUserCheckInsHistoryUseCase };
