import { hash } from "bcryptjs";

import { PrismaUsersRepository } from "@/repositories/prismaUsersRepository";

interface IRegisterUseCaseDTO {
  name: string;
  email: string;
  password: string;
}

async function registerUseCase({ name, email, password }: IRegisterUseCaseDTO) {
  const prismaUsersRepository = new PrismaUsersRepository();
  
  const emailAlreadyRegister = await prismaUsersRepository.findByEmail(email);
  
  if (emailAlreadyRegister) {
    throw new Error("Email already register!");
  }

  const password_hash = await hash(password, 6);


  await prismaUsersRepository.create({
    name,
    email,
    password_hash,
  });
}

export { registerUseCase };
