import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { inject, injectable } from "tsyringe";
import { assertIsDefined } from "../../../../core/utils/assertIsDefined";
import { env } from "../../../../core/utils/envalidUtils";
import { ITeacherRepository } from "../../domain/ITeacherRepository";

interface updateJournalBody {
  description?: string;
  publishedBy?: string;
  publishedFor?: [string];
  url?: string;
  title: string;
}

@injectable()
export class UpdateJournalController {
  constructor(
    @inject(env.INJECT_ITEACHER_REPOSITORY)
    private teacherRepository: ITeacherRepository
  ) {}

  updateJournalsController: RequestHandler<
    unknown,
    unknown,
    updateJournalBody,
    unknown
  > = async (req, res, next) => {
    try {
      const { title, description, publishedBy, publishedFor, url } = req.body;
      if (!title) throw createHttpError(422, "title is required.");

      const result = await this.teacherRepository.getJournal(title);

      assertIsDefined(result);
      if (description) {
        result.description = description;
      }
      if (publishedBy) {
        result.publishedBy = publishedBy;
      }
      if (publishedFor) {
        result.publishedFor = publishedFor;
      }
      if (url) {
        result.url = url;
      }
      await this.teacherRepository.updateJournal(result);

      const newResult = await this.teacherRepository.getJournal(title);

      return res.status(200).json(newResult);
    } catch (error) {
      next(error);
    }
  };
}
