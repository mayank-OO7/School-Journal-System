import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { inject, injectable } from "tsyringe";
import { env } from "../../../../core/utils/envalidUtils";
import { ITeacherRepository } from "../../domain/ITeacherRepository";

interface getJournalBody {
  title: string;
}

@injectable()
export class GetJournalController {
  constructor(
    @inject(env.INJECT_ITEACHER_REPOSITORY)
    private teacherRepository: ITeacherRepository
  ) {}

  getJournalsController: RequestHandler<
    unknown,
    unknown,
    getJournalBody,
    unknown
  > = async (req, res, next) => {
    try {
      const { title } = req.body;
      if (!title) throw createHttpError(422, "title is required.");

      const result = await this.teacherRepository.getJournal(title);

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
