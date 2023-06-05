import { randomUUID as uuid } from "crypto";
import { Prisma, User } from "@prisma/client";
import { IUsersRepository } from "../interfaces/IUsersRepository";

class InMemoryUsersRepository implements IUsersRepository {
  private users: User[];

  constructor() {
    this.users = [];
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const newUser = {
      id: uuid(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    };

    this.users.push(newUser);

    return newUser;
  }
  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => {
      return user.email === email;
    });

    return user ?? null;
  }
}

export { InMemoryUsersRepository };
