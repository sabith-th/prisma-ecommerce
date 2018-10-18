import * as jwt from "jsonwebtoken";
import { Prisma } from "./generated/prisma";

export interface Context {
  db: Prisma;
  request: any;
}

export function getUserId(ctx: Context, jwtToken?: string) {
  let token = "";
  if (jwtToken) {
    token = jwtToken;
  } else {
    const Authorization = ctx.request.get("Authorization");
    token = Authorization.replace("Bearer ", "");
  }
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET) as {
      userId: string;
    };
    return userId;
  }

  throw new AuthError();
}

export class AuthError extends Error {
  constructor() {
    super("Not authorized");
  }
}

export const createToken = (userId: String) =>
  jwt.sign({ userId, expiresIn: "7d" }, process.env.APP_SECRET);
