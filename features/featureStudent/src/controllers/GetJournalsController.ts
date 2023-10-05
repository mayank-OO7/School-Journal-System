import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { inject, injectable } from "tsyringe";
import { env } from "../../../../core/utils/envalidUtils";
import { IStudentRepository } from "../../domain/IStudentRepository";

interface getJournalsBody {
  username: string;
}

@injectable()
export class GetJournalsController {
  constructor(
    @inject(env.INJECT_ISTUDENT_REPOSITORY)
    private studentRepository: IStudentRepository
  ) {}

  getJournalsHandler: RequestHandler<
    unknown,
    unknown,
    getJournalsBody,
    unknown
  > = async (req, res, next) => {
    try {
      const { username } = req.body;
      if (!username) {
        throw createHttpError(422, "insufficient credentials.");
      }

      const result = await this.studentRepository.getJournals(username);

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
