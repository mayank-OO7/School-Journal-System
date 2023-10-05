import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { inject, injectable } from "tsyringe";
import { env } from "../../../../core/utils/envalidUtils";
import { ITeacherRepository } from "../../domain/ITeacherRepository";

interface deleteTeacherBody {
  username: string;
}

@injectable()
export class DeleteTeacherController {
  constructor(
    @inject(env.INJECT_ITEACHER_REPOSITORY)
    private teacherRepository: ITeacherRepository
  ) {}

  deleteTeacherHandler: RequestHandler<
    unknown,
    unknown,
    deleteTeacherBody,
    unknown
  > = async (req, res, next) => {
    try {
      const username = req.body.username;
      if (!username) throw createHttpError(422, "username is required");
      await this.teacherRepository.deleteTeacher(username);
      return res
        .status(200)
        .json({
          success: true,
          message: "Teacher entity deleted successfully.",
        });
    } catch (error) {
      next(error);
    }
  };
}
