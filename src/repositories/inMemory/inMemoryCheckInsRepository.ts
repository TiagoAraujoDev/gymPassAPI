import { randomUUID as uuid } from "crypto";
import { Prisma, CheckIn } from "@prisma/client";

import { ICheckInsRepository } from "../interfaces/ICheckInsRepository";
import dayjs from "dayjs";

class InMemoryCheckInsRepository implements ICheckInsRepository {
  private checkIns: CheckIn[];

  constructor() {
    this.checkIns = [];
  }

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = {
      id: uuid(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    };

    this.checkIns.push(checkIn);

    return checkIn;
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date,
  ): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf("date");
    const endOfTheDay = dayjs(date).endOf("date");

    const checkInOnSameDate = this.checkIns.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at);
      const isOnTheSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);

      return checkIn.user_id === userId && isOnTheSameDate;
    });

    if (!checkInOnSameDate) {
      return null;
    }

    return checkInOnSameDate;
  }
}

export { InMemoryCheckInsRepository };