import { Gym, Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { randomUUID as uuid } from "crypto";

import { IGymsRepository } from "../interfaces/IGymsRepository";

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
}

export { InMemoryGymsRepository };
