import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { inject, injectable } from "tsyringe";
import { env } from "../../../../core/utils/envalidUtils";
import { ITeacherRepository } from "../../domain/ITeacherRepository";

interface getAllJournalsBody {
  username: string;
}

@injectable()
export class GetAllJournalsController {
  constructor(
    @inject(env.INJECT_ITEACHER_REPOSITORY)
    private teacherRepository: ITeacherRepository
  ) {}

  getAllJournalsHandler: RequestHandler<
    unknown,
    unknown,
    getAllJournalsBody,
    unknown
  > = async (req, res, next) => {
    try {
      const { username } = req.body;

      if (!username) {
        throw createHttpError(422, "username is required.");
      }

      const journals = await this.teacherRepository.getAllJournalsOfTeacher(
        username
      );

      return res.status(200).json(journals);
    } catch (error) {
      next(error);
    }
  };
}
