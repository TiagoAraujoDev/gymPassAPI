import { PrismaUsersRepository } from "@/repositories/prisma/prismaUsersRepository";
import { RegisterUseCase } from "../register";

function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const registerUseCase = new RegisterUseCase(usersRepository);

  return registerUseCase;
}

export { makeRegisterUseCase };
