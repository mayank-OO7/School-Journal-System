import { RequestHandler } from "express";
import createHttpError from "http-errors";
interface validateRoleBody {
  role: string;
}
export const validateRole: RequestHandler<
  unknown,
  unknown,
  validateRoleBody,
  unknown
> = async (req, res, next) => {
  const role = req.body.role;
  if (!role || role !== "teacher") next(createHttpError(400, "wrong role"));
  next();
};
