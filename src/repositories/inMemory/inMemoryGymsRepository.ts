import { Gym, Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

import { IGymsRepository } from "../interfaces/IGymsRepository";

class InMemoryGymsRepository implements IGymsRepository {
  private gyms: Gym[];

  constructor() {
    this.gyms = [];
  }

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const newGym: Gym = {
      id: data.id ? data.id : "gym-id",
      title: data.title,
      description: data.description || "",
      phone: data.phone || "",
      latitude: new Decimal(-27.2092052),
      longitude: new Decimal(-49.6401091),
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
