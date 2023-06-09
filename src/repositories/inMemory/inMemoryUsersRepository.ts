import { Prisma, User } from "@prisma/client";
import { randomUUID as uuid } from "crypto";

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

  async findById(userId: string): Promise<User | null> {
    const user = this.users.find((user) => {
      return user.id === userId;
    });

    return user ?? null;
  }
}

export { InMemoryUsersRepository };
