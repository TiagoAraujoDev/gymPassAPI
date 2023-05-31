import "dotenv/config";
import { z } from "zod";

interface IZodErrorMessage {
  code: string;
  expected: string;
  received: string;
  path: string[];
  message: string;
}

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "prod"]).default("prod"),
  PORT: z.coerce.number().default(8080),
  HOST: z.string()
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("⚠ Environment variables error!");

  const messageError: IZodErrorMessage[] = JSON.parse(_env.error.message);

  messageError.forEach((error, i: number) => {
    console.log(`Error: #${i + 1}\n`);
    console.log(`Code\t\t=> ${error.code}`);
    console.log(`Path\t\t=> ${error.path}`);
    console.log(`Expected\t=> ${error.expected}`);
    console.log(`Received\t=> ${error.received}`);
    console.log(`Message\t\t=> ${error.message}\n`);
  });

  throw new Error("⚠ Environment variables error!");
}

export const env = _env.data;
