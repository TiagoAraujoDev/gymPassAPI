import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryGymsRepository } from "@/repositories/inMemory/inMemoryGymsRepository";
import { IGymsRepository } from "@/repositories/interfaces/IGymsRepository";

import { FetchNearbyGymsUseCase } from "./fetchNearbyGyms";

let gymsRepository: IGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe("Fetch nearby gyms UseCase", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it("should be able to fetch gyms within a 10km range", async () => {
    await gymsRepository.create({
      title: "Near gym",
      latitude: 41.1517155,
      longitude: -8.6289733,
    });

    await gymsRepository.create({
      title: "Far gym",
      latitude: 41.335727,
      longitude: -8.595991,
    });

    const { gyms } = await sut.execute({
      userLatitude: 41.1499647,
      userLongitude: -8.6431133,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Near gym" })]);
  });
});
