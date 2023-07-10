import { PrismaUsersRepository } from "@/repositories/prisma/prismaUsersRepository";

import { GetUserProfileUseCase } from "../getUserProfile";

function makeGetUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const getUserProfileUseCase = new GetUserProfileUseCase(usersRepository);

  return getUserProfileUseCase;
}

export { makeGetUserProfileUseCase };
