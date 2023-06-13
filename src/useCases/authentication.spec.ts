import { beforeEach, describe, expect, it } from "vitest";
import { hash } from "bcryptjs";

import { InMemoryUsersRepository } from "@/repositories/inMemory/inMemoryUsersRepository";
import { IUsersRepository } from "@/repositories/interfaces/IUsersRepository";
import { InvalidCredentialsError } from "./error/invalidCredentialsError";
import { AuthenticationUseCase } from "./authentication";

let usersRepository: IUsersRepository;
let sut: AuthenticationUseCase;

describe("Authentication useCase", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticationUseCase(usersRepository);
  });

  it("should be able to authenticate user", async () => {
    await usersRepository.create({
      name: "Jonh Doe",
      email: "jonhdoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      email: "jonhdoe@example.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate a user that doesn't exist", async () => {
    await expect(() =>
      sut.execute({
        email: "jonhdoe@example.com",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate a user with a wrong password", async () => {
    await usersRepository.create({
      name: "Jonh Doe",
      email: "jonhdoe@example.com",
      password_hash: await hash("123456", 6),
    });

    await expect(() =>
      sut.execute({
        email: "jonhdoe@example.com",
        password: "123123",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
