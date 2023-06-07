import { beforeEach, describe, expect, it } from "vitest";
import { compare } from "bcryptjs";

import { InMemoryUsersRepository } from "@/repositories/inMemory/inMemoryUsersRepository";
import { IUsersRepository } from "@/repositories/interfaces/IUsersRepository";
import { UserAlreadyExistError } from "./error/userAlreadyExistError";
import { RegisterUseCase } from "./register";

let usersRepository: IUsersRepository;
let sut: RegisterUseCase;

describe("Register use case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });
  
  it("should be able to register an user", async () => {
    const { user } = await sut.execute({
      name: "Jonh Doe",
      email: "jonhdoe@example.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash the user password upon registration", async () => {
    const { user } = await sut.execute({
      name: "Jonh Doe",
      email: "jonhdoe@example.com",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash,
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not register an user with the same email", async () => {
    const email = "jonhdoe@example.com";

    await sut.execute({
      name: "Jonh Doe",
      email,
      password: "123456",
    });

    await expect(() =>
      sut.execute({
        name: "Jonh Doe",
        email,
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistError);
  });
});
