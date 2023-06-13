import { randomUUID as uuid } from "crypto";
import { beforeEach, describe, expect, it } from "vitest";
import { hash } from "bcryptjs";

import { GetUserProfileUseCase } from "./getUserProfileUseCase";
import { InMemoryUsersRepository } from "@/repositories/inMemory/inMemoryUsersRepository";
import { IUsersRepository } from "@/repositories/interfaces/IUsersRepository";
import { ResourceNotFoundError } from "./error/resourceNotFoundError";

let usersRepository: IUsersRepository;
let sut: GetUserProfileUseCase;

describe("Get user Profile useCase", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it("should be able to get a user profile", async () => {
    const _user = await usersRepository.create({
      name: "Jonh Doe",
      email: "jonhdoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      userId: _user.id,
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toEqual("Jonh Doe");
  });

  it("should not be able to return a user that doesn't exist", async () => {
    await usersRepository.create({
      name: "Jonh Doe",
      email: "jonhdoe@example.com",
      password_hash: await hash("123456", 6),
    });

    await expect(() =>
      sut.execute({
        userId: uuid(),
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
