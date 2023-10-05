import { inject, injectable } from "tsyringe";
import { env } from "../../../../core/utils/envalidUtils";
import { ITeacherRepository } from "../../domain/ITeacherRepository";
import { RequestHandler } from "express";
import { assertIsDefined } from "../../../../core/utils/assertIsDefined";
import { IJournalModel } from "../../../../core/data/IJournalModel";

interface createJournalBody {
  description: string;
  publishedBy: string;
  publishedFor: [string];
  url?: string;
  title: string;
}

@injectable()
export class CreateJournalController {
  constructor(
    @inject(env.INJECT_ITEACHER_REPOSITORY)
    private teacherRepository: ITeacherRepository
  ) {}

  createJournalHandler: RequestHandler<
    unknown,
    unknown,
    createJournalBody,
    unknown
  > = async (req, res, next) => {
    try {
      assertIsDefined(this.teacherRepository);
      const journalModel: IJournalModel = {
        description: req.body.description,
        publishedBy: req.body.publishedBy,
        publishedFor: req.body.publishedFor,
        title: req.body.title,
      };
      await this.teacherRepository.createJournal(journalModel);
      return res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  };
}
