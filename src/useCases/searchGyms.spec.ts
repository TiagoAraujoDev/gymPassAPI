import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryGymsRepository } from "@/repositories/inMemory/inMemoryGymsRepository";
import { IGymsRepository } from "@/repositories/interfaces/IGymsRepository";

import { SearchGymsUseCase } from "./searchGyms";

let gymsRepository: IGymsRepository;
let sut: SearchGymsUseCase;

describe("Search gyms UseCase", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it("should be able to search a gym given a query string", async () => {
    await gymsRepository.create({
      title: "Test gym",
      latitude: 0,
      longitude: 0,
    });

    await gymsRepository.create({
      title: "Second",
      latitude: 0,
      longitude: 0,
    });

    const { gyms } = await sut.execute({ query: "gym", page: 1 });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Test gym" })]);
  });

  it("should be able to fetch paginated gym search", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Test gym ${i}`,
        latitude: 0,
        longitude: 0,
      });
    }

    const { gyms } = await sut.execute({ query: "gym", page: 2 });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Test gym 21" }),
      expect.objectContaining({ title: "Test gym 22" }),
    ]);
  });
});
