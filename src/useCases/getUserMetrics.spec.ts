import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryCheckInsRepository } from "@/repositories/inMemory/inMemoryCheckInsRepository";
import { ICheckInsRepository } from "@/repositories/interfaces/ICheckInsRepository";

import { GetUserMetricsUseCase } from "./getUserMetrics";

let checkInsRepository: ICheckInsRepository;
let sut: GetUserMetricsUseCase;

describe("Count user metrics UseCase", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsUseCase(checkInsRepository);
  });

  it("should be able to get check-ins count from metrics", async () => {
    for (let i = 1; i <= 4; i++) {
      await checkInsRepository.create({
        gym_id: "gym-1",
        user_id: "user-1",
      });
    }

    const { checkInsCount } = await sut.execute({
      userId: "user-1",
    });

    expect(checkInsCount).toEqual(4);
  });
});
