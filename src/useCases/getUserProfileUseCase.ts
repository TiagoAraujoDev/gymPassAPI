import { User } from "@prisma/client";

import { IUsersRepository } from "@/repositories/interfaces/IUsersRepository";
import { ResourceNotFoundError } from "./error/resourceNotFoundError";

interface IGetUserProfileUseCaseRequest {
  userId: string;
}

interface IGetUserProfileUseCaseResponse {
  user: User;
}

class GetUserProfileUseCase {
  constructor(private usersRepository: IUsersRepository) { }

  async execute({
    userId,
  }: IGetUserProfileUseCaseRequest): Promise<IGetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    return {
      user,
    };
  }
}

export { GetUserProfileUseCase };
