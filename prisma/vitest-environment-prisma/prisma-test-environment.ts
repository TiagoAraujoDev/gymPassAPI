import { Environment } from "vitest";

export default <Environment> {
  name: "prisma",
  async setup() {
    console.log("Executed");

    return {
      teardown(): void {
        console.log("After execution");
      },
    };
  }
};
