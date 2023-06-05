import { hash } from "bcryptjs";
import { User } from "@prisma/client";

import { IUsersRepository } from "@/repositories/interfaces/IUsersRepository";
import { UserAlreadyExistError } from "./error/userAlreadyExistError";

interface IRegisterUseCaseDTO {
  name: string;
  email: string;
  password: string;
}

interface IRegisterUseCaseResponse {
  user: User;
}

class RegisterUseCase {
  constructor(private usersRepository: IUsersRepository) { }

  async execute({
    name,
    email,
    password,
  }: IRegisterUseCaseDTO): Promise<IRegisterUseCaseResponse> {
    const emailAlreadyRegister = await this.usersRepository.findByEmail(email);

    if (emailAlreadyRegister) {
      throw new UserAlreadyExistError();
    }

    const password_hash = await hash(password, 6);

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    });

    return {
      user,
    };
  }
}

export { RegisterUseCase };
