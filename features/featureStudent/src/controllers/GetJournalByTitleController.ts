import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { inject, injectable } from "tsyringe";
import { env } from "../../../../core/utils/envalidUtils";
import { IStudentRepository } from "../../domain/IStudentRepository";

interface getJournalBody {
  title: string;
  username: string;
}

@injectable()
export class GetJournalByTitleController {
  constructor(
    @inject(env.INJECT_ISTUDENT_REPOSITORY)
    private studentRepository: IStudentRepository
  ) {}

  getJournalByTitleHandler: RequestHandler<
    unknown,
    unknown,
    getJournalBody,
    unknown
  > = async (req, res, next) => {
    try {
      const { title, username } = req.body;
      if (!title || !username)
        throw createHttpError(409, "Insufficient credentials");

      const journal = await this.studentRepository.getJournalByTitle(
        username,
        title
      );
      return res.status(200).json(journal);
    } catch (error) {
      next(error);
    }
  };
}
