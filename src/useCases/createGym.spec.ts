import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryGymsRepository } from "@/repositories/inMemory/inMemoryGymsRepository";
import { IGymsRepository } from "@/repositories/interfaces/IGymsRepository";

import { CreateGymUseCase } from "./createGym";

let gymsRepository: IGymsRepository;
let sut: CreateGymUseCase;

describe("Create Gym UseCase", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it("should be able to create a gym", async () => {
    const { gym } = await sut.execute({
      title: "Title test",
      description: "Description test",
      phone: "1234-4312",
      latitude: 0,
      longitude: 0,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
