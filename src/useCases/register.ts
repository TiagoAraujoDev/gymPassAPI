import { hash } from "bcryptjs";

import { IUsersRepository } from "@/repositories/interfaces/IUsersRepository";
import { UserAlreadyExistError } from "./error/userAlreadyExistError";

interface IRegisterUseCaseDTO {
  name: string;
  email: string;
  password: string;
}

class RegisterUseCase {
  constructor(private usersRepository: IUsersRepository) {}
  
  async execute({ name, email, password }: IRegisterUseCaseDTO) {
    const emailAlreadyRegister = await this.usersRepository.findByEmail(email);

    if (emailAlreadyRegister) {
      throw new UserAlreadyExistError();
    }

    const password_hash = await hash(password, 6);

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    });
  }
}

export { RegisterUseCase };
