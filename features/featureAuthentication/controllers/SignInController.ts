import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { inject, injectable } from "tsyringe";
import { env } from "../../../core/utils/envalidUtils";
import {
  genPassword,
  issueJWT,
  passwordType,
  validPassword,
} from "../../../core/utils/jwtUtils";
import { IStudentModel } from "../../featureStudent/domain/IStudentModel";
import { IStudentRepository } from "../../featureStudent/domain/IStudentRepository";
import { ITeacherModel } from "../../featureTeacher/domain/ITeacherModel";
import { ITeacherRepository } from "../../featureTeacher/domain/ITeacherRepository";

interface signinBody {
  role: string;
  username: string;
  password: string;
}

@injectable()
export class SignInController {
  constructor(
    @inject(env.INJECT_ISTUDENT_REPOSITORY)
    private studentRepository: IStudentRepository,
    @inject(env.INJECT_ITEACHER_REPOSITORY)
    private teacherReposiroty: ITeacherRepository
  ) {}

  signinHandler: RequestHandler<unknown, unknown, signinBody, unknown> = async (
    req,
    res,
    next
  ) => {
    try {
      const { role, username, password } = req.body;
      if (!role || !username || !password)
        throw createHttpError(422, "insufficient data.");

      if (role == "teacher") {
        const user = await this.teacherReposiroty.getTeacherByUsername(
          username
        );
        if (!username) {
          throw createHttpError(422, "insufficient data");
        }
        if (!user) throw createHttpError(404, "user not found");
        const passwordHashed: passwordType = {
          hash: user.hash,
          salt: user.salt,
        };

        const isPasswordValid = validPassword(password, passwordHashed);

        if (!isPasswordValid) throw createHttpError(400, "invalid password");

        const token = issueJWT(username);

        return res.status(201).json({ jwt: token });
      } else if (role == "student") {
        const user = await this.studentRepository.getStudentByUsername(
          username
        );
        if (!username) {
          throw createHttpError(422, "insufficient data");
        }
        if (!user) throw createHttpError(404, "user not found");
        const passwordHashed: passwordType = {
          hash: user.hash,
          salt: user.salt,
        };

        const isPasswordValid = validPassword(password, passwordHashed);

        if (!isPasswordValid) throw createHttpError(400, "invalid password");
        const token = issueJWT(username);
        return res.status(201).json({ jwt: token });
      } else {
        throw createHttpError(400, "wrong role.");
      }
    } catch (error) {
      next(error);
    }
  };
}
