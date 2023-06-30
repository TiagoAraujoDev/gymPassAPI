import { Gym } from "@prisma/client";

import { IGymsRepository } from "@/repositories/interfaces/IGymsRepository";

interface searchGymsUseCaseRequest {
  query: string;
  page: number;
}

interface searchGymsUseCaseResponse {
  gyms: Gym[];
}

class SearchGymsUseCase {
  constructor(private gymsRepository: IGymsRepository) {}

  async execute({
    query,
    page,
  }: searchGymsUseCaseRequest): Promise<searchGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page);

    return {
      gyms,
    };
  }
}

export { SearchGymsUseCase };
