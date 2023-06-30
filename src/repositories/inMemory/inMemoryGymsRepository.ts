import { Gym, Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { randomUUID as uuid } from "crypto";

import { getDistanceBetweenCoordinates } from "@/utils/getDistanceBetweenCoordanetes";

import {
  FindManyNearbyParams,
  IGymsRepository,
} from "../interfaces/IGymsRepository";

class InMemoryGymsRepository implements IGymsRepository {
  public gyms: Gym[] = [];

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const newGym: Gym = {
      id: uuid(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
    };

    this.gyms.push(newGym);

    return newGym;
  }

  async findById(gymId: string): Promise<Gym | null> {
    const gym = this.gyms.find((gym) => gym.id === gymId);

    if (!gym) return null;

    return gym;
  }

  async findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
    const MAX_DISTANCE_IN_kILOMETERS = 10;

    const gyms = this.gyms.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: params.latitude, longitude: params.longitude },
        {
          latitude: gym.latitude.toNumber(),
          longitude: gym.longitude.toNumber(),
        },
      );

      return distance < MAX_DISTANCE_IN_kILOMETERS;
    });

    return gyms;
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    const gyms = this.gyms
      .filter((gym) => gym.title.includes(query))
      .slice((page - 1) * 20, page * 20);

    return gyms;
  }
}

export { InMemoryGymsRepository };
