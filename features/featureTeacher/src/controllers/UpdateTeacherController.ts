import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { inject, injectable } from "tsyringe";
import { env } from "../../../../core/utils/envalidUtils";
import { ITeacherRepository } from "../../domain/ITeacherRepository";

interface updateTeacherBody {
  username: string;
  name?: string;
  hash?: string;
  salt?: string;
}

@injectable()
export class UpdateTeacherController {
  constructor(
    @inject(env.INJECT_ITEACHER_REPOSITORY)
    private teacherRepository: ITeacherRepository
  ) {}

  updateTeacherHandler: RequestHandler<
    unknown,
    unknown,
    updateTeacherBody,
    unknown
  > = async (req, res, next) => {
    try {
      const { username, name, hash, salt } = req.body;
      const oldRecord = await this.teacherRepository.getTeacherByUsername(
        username
      );

      if (!oldRecord) throw createHttpError(404, "user not found");
      //   logger.info(`oldRecord: ${JSON.stringify(oldRecord)}`);
      if (name) {
        oldRecord.name = name;
      }
      if (hash) {
        oldRecord.hash = hash;
      }
      if (salt) {
        oldRecord.salt = salt;
      }
      await this.teacherRepository.updateTeacher(oldRecord);
      return res
        .status(200)
        .json({ success: true, message: "Entity updated successfully" });
    } catch (error) {
      next(error);
    }
  };
}
