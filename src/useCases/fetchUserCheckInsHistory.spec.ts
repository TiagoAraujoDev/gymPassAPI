import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryCheckInsRepository } from "@/repositories/inMemory/inMemoryCheckInsRepository";
import { ICheckInsRepository } from "@/repositories/interfaces/ICheckInsRepository";

import { FetchuserCheckInsHistoryUseCase } from "./fetchUserCheckInsHistory";

let checkInsRepository: ICheckInsRepository;
let sut: FetchuserCheckInsHistoryUseCase;

describe("Fetch user check-ins history UseCase", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new FetchuserCheckInsHistoryUseCase(checkInsRepository);
  });

  it("should be able to fetch users check-ins history", async () => {
    await checkInsRepository.create({
      gym_id: "gym-1",
      user_id: "user-1",
    });

    await checkInsRepository.create({
      gym_id: "gym-2",
      user_id: "user-1",
    });

    const { checkIns } = await sut.execute({
      userId: "user-1",
      page: 1,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-1" }),
      expect.objectContaining({ gym_id: "gym-2" }),
    ]);
  });

  it("should be able to fetch paginated users check-ins history", async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gym_id: `gym-${i}`,
        user_id: "user-1",
      });
    }

    const { checkIns } = await sut.execute({
      userId: "user-1",
      page: 2,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-21" }),
      expect.objectContaining({ gym_id: "gym-22" }),
    ]);
  });
});
