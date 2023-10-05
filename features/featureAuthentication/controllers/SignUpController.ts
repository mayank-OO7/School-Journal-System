import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { inject, injectable } from "tsyringe";
import { env } from "../../../core/utils/envalidUtils";
import { genPassword, issueJWT } from "../../../core/utils/jwtUtils";
import { IStudentModel } from "../../featureStudent/domain/IStudentModel";
import { IStudentRepository } from "../../featureStudent/domain/IStudentRepository";
import { ITeacherModel } from "../../featureTeacher/domain/ITeacherModel";
import { ITeacherRepository } from "../../featureTeacher/domain/ITeacherRepository";

interface signupBody {
  role: string;
  username: string;
  password: string;
  name: string;
}

@injectable()
export class SignUpController {
  constructor(
    @inject(env.INJECT_ISTUDENT_REPOSITORY)
    private studentRepository: IStudentRepository,
    @inject(env.INJECT_ITEACHER_REPOSITORY)
    private teacherReposiroty: ITeacherRepository
  ) {}

  signupHandler: RequestHandler = async (req, res, next) => {
    try {
      const { role, username, password, name } = req.body;
      if (!role || !username || !password)
        throw createHttpError(422, "insufficient data.");

      const { salt, hash } = genPassword(password);
      const token = issueJWT(username);

      if (role == "teacher") {
        const teacherModel: ITeacherModel = {
          hash: hash,
          salt: salt,
          name: name,
          username: username,
          journals: [],
        };

        await this.teacherReposiroty.createTeacher(teacherModel);
        return res.status(201).json({ jwt: token });
      } else if (role == "student") {
        const studentModel: IStudentModel = {
          hash: hash,
          salt: salt,
          journals: [],
          name: name,
          username: username,
        };
        await this.studentRepository.createStudent(studentModel);
        return res.status(201).json({ jwt: token });
      } else {
        throw createHttpError(400, "wrong role.");
      }
    } catch (error) {
      next(error);
    }
  };
}
