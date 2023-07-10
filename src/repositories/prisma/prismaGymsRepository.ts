import { Prisma, Gym } from "@prisma/client";

import { prisma } from "@/lib/prisma";

import {
  FindManyNearbyParams,
  IGymsRepository,
} from "../interfaces/IGymsRepository";

class PrismaGymsRepository implements IGymsRepository {
  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = await prisma.gym.create({
      data,
    });

    return gym;
  }

  async findById(gymId: string): Promise<Gym | null> {
    const gym = await prisma.gym.findUnique({
      where: {
        id: gymId,
      },
    });

    return gym;
  }

  async findManyNearby({
    latitude,
    longitude,
  }: FindManyNearbyParams): Promise<Gym[]> {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * from gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `;

    return gyms;
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      skip: (page - 1) * 20,
      take: 20,
    });

    return gyms;
  }
}

export { PrismaGymsRepository };
