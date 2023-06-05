import { describe, expect, it } from "vitest";
import { compare } from "bcryptjs";

import { RegisterUseCase } from "./register";
import { InMemoryUsersRepository } from "@/repositories/inMemory/inMemoryUsersRepository";
import { UserAlreadyExistError } from "./error/userAlreadyExistError";

describe("Register use case", () => {
  it("should be able to register an user", async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(inMemoryUsersRepository);

    const { user } = await registerUseCase.execute({
      name: "Jonh Doe",
      email: "jonhdoe@example.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });
  
  it("should hash the user password upon registration", async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(inMemoryUsersRepository);

    const { user } = await registerUseCase.execute({
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
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(inMemoryUsersRepository);

    const email = "jonhdoe@example.com";

    await registerUseCase.execute({
      name: "Jonh Doe",
      email,
      password: "123456",
    });

    await expect(() =>
      registerUseCase.execute({
        name: "Jonh Doe",
        email,
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistError);
  });
});
