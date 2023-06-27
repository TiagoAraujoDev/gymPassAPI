import { CheckIn, Prisma } from "@prisma/client";

interface ICheckInsRepository {
  create: (data: Prisma.CheckInUncheckedCreateInput) => Promise<CheckIn>;
  findByUserIdOnDate: (userId: string, date: Date) => Promise<CheckIn | null>;
}

export { ICheckInsRepository };
