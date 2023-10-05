import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    export interface User {
      id: string;
      token: string;
      username: string;
    }
    export interface Request {
      jwt: JwtPayload | string;
      token: string;
    }
  }
}
