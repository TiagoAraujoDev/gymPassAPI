import { describe, expect, it } from "vitest";
import { hash } from "bcryptjs";

import { InMemoryUsersRepository } from "@/repositories/inMemory/inMemoryUsersRepository";
import { AuthenticationUseCase } from "./authentication";
import { InvalidCredentialsError } from "./error/invalidCredentialsError";

describe("Authentication useCase", () => {
  it("should be able to authenticate user", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticationUseCase(usersRepository);

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
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticationUseCase(usersRepository);

    expect(() =>
      sut.execute({
        email: "jonhdoe@example.com",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
  
  it("should not be able to authenticate a user with a wrong password", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticationUseCase(usersRepository);

    await usersRepository.create({
      name: "Jonh Doe",
      email: "jonhdoe@example.com",
      password_hash: await hash("123456", 6),
    });

    expect(() =>
      sut.execute({
        email: "jonhdoe@example.com",
        password: "123123",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
