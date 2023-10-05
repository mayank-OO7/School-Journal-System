import { JwtPayload } from "jsonwebtoken";

export {};

declare global {
  namespace Express {
    interface User {
      id: string;
      token: string;
      username: string;
    }
    interface Request {
      jwt: JwtPayload | string;
      token: string;
    }
  }
}
