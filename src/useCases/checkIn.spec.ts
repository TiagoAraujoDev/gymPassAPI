import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Decimal } from "@prisma/client/runtime/library";

import { CheckInUseCase } from "./checkIn";
import { ICheckInsRepository } from "@/repositories/interfaces/ICheckInsRepository";
import { InMemoryCheckInsRepository } from "@/repositories/inMemory/inMemoryCheckInsRepository";
import { IGymsRepository } from "@/repositories/interfaces/IGymsRepository";
import { InMemoryGymsRepository } from "@/repositories/inMemory/inMemoryGymsRepository";

let checkInsRepository: ICheckInsRepository;
let gymsRepository: IGymsRepository;
let sut: CheckInUseCase;

describe("Check-in Use Case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    gymsRepository.create({
      id: "gym-id",
      title: "Test gym",
      latitude: new Decimal(-27.2092052),
      longitude: new Decimal(-49.6401091),
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-id",
      userId: "user-id",
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    await sut.execute({
      gymId: "gym-id",
      userId: "user-id",
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-id",
        userId: "user-id",
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it("should be able to check in twice but in diferent days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));
    await sut.execute({
      gymId: "gym-id",
      userId: "user-id",
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));
    const { checkIn } = await sut.execute({
      gymId: "gym-id",
      userId: "user-id",
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in to a gym out of range", async () => {
    gymsRepository.create({
      id: "gym-id",
      title: "Test gym",
      latitude: new Decimal(-27.2092052),
      longitude: new Decimal(-49.6401091),
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-id",
        userId: "user-id",
        userLatitude: 38.7436266,
        userLongitude: -9.1602032,
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
