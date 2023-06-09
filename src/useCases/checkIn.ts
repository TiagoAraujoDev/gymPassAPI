import { CheckIn } from "@prisma/client";

import { ICheckInsRepository } from "@/repositories/interfaces/ICheckInsRepository";
import { IGymsRepository } from "@/repositories/interfaces/IGymsRepository";
import { getDistanceBetweenCoordinates } from "@/utils/getDistanceBetweenCoordanetes";

import { MaxDistanceError } from "./error/maxDistanceError";
import { MaxNumberOfCheckInsError } from "./error/maxNumberOfCheckInsError";
import { ResourceNotFoundError } from "./error/resourceNotFoundError";

interface ICheckInUseCaseRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface ICheckInUseCaseResponse {
  checkIn: CheckIn;
}

class CheckInUseCase {
  constructor(
    private checkInsRepository: ICheckInsRepository,
    private gymsRepository: IGymsRepository,
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: ICheckInUseCaseRequest): Promise<ICheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId);

    if (!gym) {
      throw new ResourceNotFoundError();
    }

    const MAX_DISTANCE_IN_kILOMETERS = 0.1;

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    );

    if (distance > MAX_DISTANCE_IN_kILOMETERS) {
      throw new MaxDistanceError();
    }

    const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    );

    if (checkInOnSameDate) {
      throw new MaxNumberOfCheckInsError();
    }

    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    });

    return {
      checkIn,
    };
  }
}

export { CheckInUseCase };
