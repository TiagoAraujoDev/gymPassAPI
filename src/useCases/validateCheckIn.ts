import { CheckIn } from "@prisma/client";
import dayjs from "dayjs";

import { ICheckInsRepository } from "@/repositories/interfaces/ICheckInsRepository";

import { LateCheckInValidationError } from "./error/lateCheckInValidationError";
import { ResourceNotFoundError } from "./error/resourceNotFoundError";

interface ValidateCheckInUseCaseRequest {
  checkInId: string;
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn;
}

class ValidateCheckInUseCase {
  constructor(private checkInsRepository: ICheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFoundError();
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      "minutes",
    );

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError();
    }

    checkIn.validated_at = new Date();
    await this.checkInsRepository.save(checkIn);

    return {
      checkIn,
    };
  }
}

export { ValidateCheckInUseCase };
