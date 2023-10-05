import { RequestHandler } from "express";
import { inject, injectable } from "tsyringe";
import { env } from "../../../../core/utils/envalidUtils";
import { ITeacherRepository } from "../../domain/ITeacherRepository";

interface getTeacherByUsernameParams {
  username: string;
}

@injectable()
export class GetTeacherByUsername {
  constructor(
    @inject(env.INJECT_ITEACHER_REPOSITORY)
    private teacherRepository: ITeacherRepository
  ) {}

  getTeacherByUsername: RequestHandler<
    getTeacherByUsernameParams,
    unknown,
    unknown,
    unknown
  > = async (req, res, next) => {
    try {
      const { username } = req.params;
      const teacher = await this.teacherRepository.getTeacherByUsername(
        username
      );
      return res.status(200).json(teacher);
    } catch (error) {
      next(error);
    }
  };
}
