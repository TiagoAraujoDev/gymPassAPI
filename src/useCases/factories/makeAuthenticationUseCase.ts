import { PrismaUsersRepository } from "@/repositories/prisma/prismaUsersRepository";

import { AuthenticationUseCase } from "../authentication";

function makeAuthenticationUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const authenticationUseCase = new AuthenticationUseCase(usersRepository);

  return authenticationUseCase;
}

export { makeAuthenticationUseCase };
