import { Gym, Prisma } from "@prisma/client";

interface IGymsRepository {
  create: (data: Prisma.GymCreateInput) => Promise<Gym>;
  findById: (gymId: string) => Promise<Gym | null>;
  searchMany: (query: string, page: number) => Promise<Gym[]>;
}

export { IGymsRepository };
