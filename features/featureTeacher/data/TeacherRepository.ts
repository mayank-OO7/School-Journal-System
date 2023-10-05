import { injectable, singleton } from "tsyringe";
import { env } from "../../../core/utils/envalidUtils";
import { ITeacherRepository } from "../domain/ITeacherRepository";
import { IJournalModel } from "../../../core/data/IJournalModel";
import { ITeacherModel } from "../domain/ITeacherModel";
import createHttpError from "http-errors";
import dbConnection from "../../../core/data/database/connection/knexDbConnection";
import { logger } from "../../../core/utils/winstonLogger";

@injectable()
@singleton()
export class TeacherRepository implements ITeacherRepository {
  async getAllJournalsOfTeacher(username: string): Promise<IJournalModel[]> {
    // await dbConnection.schema.dropTable(env.TABLE_JOURNAL);
    // await dbConnection.schema.dropTable(env.TABLE_STUDENT);
    // await dbConnection.schema.dropTable(env.TABLE_TEACHER);
    const teacher = await this.getTeacherByUsername(username);
    if (!teacher) throw createHttpError(404, "user not found");
    const journalTitles = teacher.journals;
    const journals: IJournalModel[] = [];

    for (const title in journalTitles) {
      const journal = await this.getJournal(title);
      if (journal) journals.push(journal);
    }

    return journals;
  }

  async getJournal(title: string): Promise<IJournalModel | null> {
    const result = await dbConnection(env.TABLE_JOURNAL)
      .where("title", "=", title)
      .select()
      .first();

    if (!result) {
      return null;
      throw createHttpError(404, "journal not found");
    }

    logger.info(`result: ${JSON.stringify(result)}`);

    const journal: IJournalModel = {
      description: result.desc,
      publishedBy: result.publishedBy,
      publishedFor: result.publishedfor,
      title: result.title,
      imagePath: result.imagePath,
      pdfPath: result.pdfPath,
      publishedAt: result.publishedAt,
      url: result.url,
      videoPath: result.videoPath,
    };

    return journal;
  }
  // private dbConnection: Knex;
  async createTeacher(teacher: ITeacherModel): Promise<boolean> {
    const user = await dbConnection
      .table(env.TABLE_TEACHER)
      .where("username", "=", teacher.username);
    if (user.length > 0) throw createHttpError(409, "user already exist");
    await dbConnection.table(env.TABLE_TEACHER).insert({
      name: teacher.name,
      hash: teacher.hash,
      salt: teacher.salt,
      username: teacher.username,
      journals: teacher.journals,
    });
    // logger.info(`result: ${JSON.stringify(result)}`);
    return true;
  }
  async deleteTeacher(username: string): Promise<boolean> {
    const user = await dbConnection
      .table(env.TABLE_TEACHER)
      .where("username", "=", username)
      .select()
      .first();

    logger.info(`user is ${user}`);

    if (!user) {
      throw createHttpError(404, "user don't exist.");
    }

    const result = await dbConnection
      .table(env.TABLE_TEACHER)
      .where("username", "=", username)
      .delete();
    return result > 0;
  }
  async updateTeacher(teacher: ITeacherModel): Promise<boolean> {
    await dbConnection
      .table(env.TABLE_TEACHER)
      .insert({
        username: teacher.username,
        name: teacher.name,
        hash: teacher.hash,
        salt: teacher.salt,
      })
      .onConflict("username")
      .merge();

    return true;
  }
  async getTeacherByUsername(username: string): Promise<ITeacherModel | null> {
    const element = await dbConnection
      .table(env.TABLE_TEACHER)
      .where("username", "=", username)
      .select()
      .first();

    if (!element) return null;

    const teacherModel: ITeacherModel = {
      hash: element.hash,
      name: element.name,
      journals: element.journals,
      salt: element.salt,
      username: element.username,
    };

    return teacherModel;
  }

  async removeJournal(title: string): Promise<boolean> {
    const journal = await dbConnection(env.TABLE_JOURNAL)
      .where("title", "=", title)
      .select();

    if (journal.length == 0)
      throw createHttpError(404, "no journal found with this username.");

    const result = await dbConnection(env.TABLE_JOURNAL)
      .where("title", "=", title)
      .delete();

    return result > 0;
  }
  async updateJournal(journal: IJournalModel): Promise<boolean> {
    await dbConnection
      .table(env.TABLE_JOURNAL)
      .insert({
        desc: journal.description,
        title: journal.title,
        publishedBy: journal.publishedBy,
        pubishedfor: ["abc"],
        videoPath: journal.videoPath,
        imagePath: journal.imagePath,
        pdfPath: journal.pdfPath,
        url: journal.url,
      })
      .onConflict("title")
      .merge();

    return true;
  }
  async createJournal(journal: IJournalModel): Promise<boolean> {
    try {
      const exist = await dbConnection(env.TABLE_TEACHER)
        .where("username", "=", journal.publishedBy)
        .select()
        .first();

      if (!exist) {
        throw createHttpError(404, "user not exist.");
      }

      const result = await dbConnection.table(env.TABLE_JOURNAL).insert({
        desc: journal.description,
        publishedBy: journal.publishedBy,
        publishedfor: journal.publishedFor,
        title: journal.title,
      });
      logger.info(`${JSON.stringify(result)}`);
      await dbConnection(env.TABLE_TEACHER).update({
        journals: dbConnection.raw("array_append(journals, ?)", [
          journal.title,
        ]),
      });
      // const teacher = await this.getTeacherByUsername(journal.publishedBy);
      // teacher.journals.push(journal.title);
      // await this.updateTeacher(teacher);
      return true;
    } catch (error) {
      logger.error(error);
      throw createHttpError(500, "unable to create journal.");
    }
  }
}
