import { inject, injectable } from "tsyringe";
import { env } from "../../../../core/utils/envalidUtils";
import { ITeacherRepository } from "../../domain/ITeacherRepository";
import { RequestHandler } from "express";
import { assertIsDefined } from "../../../../core/utils/assertIsDefined";
import { ITeacherModel } from "../../domain/ITeacherModel";
import createHttpError from "http-errors";
import { logger } from "../../../../core/utils/winstonLogger";

interface createTeacherBody {
  username: string;
  hash: string;
  salt: string;
  name: string;
  journal: string;
}

@injectable()
export class CreateTeacherController {
  constructor(
    @inject(env.INJECT_ITEACHER_REPOSITORY)
    private teacherRepository: ITeacherRepository
  ) {}

  createJournalHandler: RequestHandler<
    unknown,
    unknown,
    createTeacherBody,
    unknown
  > = async (req, res, next) => {
    try {
      assertIsDefined(this.teacherRepository);
      assertIsDefined(req.body);
      if (!req.body.username)
        throw createHttpError(422, "Username is required.");
      const teacherModel: ITeacherModel = {
        hash: req.body.hash,
        salt: req.body.salt,
        name: req.body.name,
        username: req.body.username,
        journals: [req.body.journal],
      };
      await this.teacherRepository.createTeacher(teacherModel);
      return res.status(200).json({ success: true });
    } catch (error) {
      logger.error(`${JSON.stringify(error)}`);
      next(error);
    }
  };
}
