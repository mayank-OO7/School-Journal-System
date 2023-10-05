import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { inject } from "tsyringe";
import { env } from "../../../../core/utils/envalidUtils";
import { IStudentRepository } from "../../domain/IStudentRepository";

interface createStudentBody {
  username: string;
  hash: string;
  salt: string;
  name: string;
}

export class CreateStudentController {
  constructor(
    @inject(env.INJECT_ISTUDENT_REPOSITORY)
    private studentRepository: IStudentRepository
  ) {}

  createStudentHandler: RequestHandler<
    unknown,
    unknown,
    createStudentBody,
    unknown
  > = async (req, res, next) => {
    try {
      const { username, hash, salt, name } = req.body;
      if (!username || !name || !salt || !hash) {
        throw createHttpError(422, "insufficient credentials");
      }
      const userExist = await this.studentRepository.getStudentByUsername(
        username
      );
      if (userExist) throw createHttpError(409, "user already exist");
      await this.studentRepository.createStudent({
        username: username,
        hash: hash,
        salt: salt,
        name: name,
        journals: [],
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  };
}
