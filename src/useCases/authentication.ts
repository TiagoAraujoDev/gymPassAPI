import { User } from "@prisma/client";

import { IUsersRepository } from "@/repositories/interfaces/IUsersRepository";
import { InvalidCredentialsError } from "./error/invalidCredentialsError";
import { compare } from "bcryptjs";

interface IAuthenticationUseCaseRequest {
  email: string;
  password: string;
}

interface IAuthenticationUseCaseResponse {
  user: User;
}

class AuthenticationUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    email,
    password,
  }: IAuthenticationUseCaseRequest): Promise<IAuthenticationUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const doesPasswordMatches = await compare(password, user.password_hash);

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError();
    }

    return {
      user,
    };
  }
}

export { AuthenticationUseCase };
