import { IJournalModel } from "../../../core/data/IJournalModel";
import { IStudentModel } from "../domain/IStudentModel";
import { IStudentRepository } from "../domain/IStudentRepository";
import dbConnection from "../../../core/data/database/connection/knexDbConnection";
import { env } from "../../../core/utils/envalidUtils";
import { injectable, singleton } from "tsyringe";
// import { Journal, Student } from "knex/types/tables";
import createHttpError from "http-errors";

interface Student {
  id: number;
  username: string;
  name: string;
  hash: string;
  salt: string;
  journals: string[];
}

interface Journal {
  id: number;
  desc: string;
  title: string;
  publishedBy: string;
  publishedfor: [string];
  timestamp: string;
  videoPath?: string;
  imagepath?: string;
  pdfPath?: string;
  url?: string;
}

@injectable()
@singleton()
export class StudentRepository implements IStudentRepository {
  async getStudentByUsername(username: string): Promise<IStudentModel | null> {
    const student = await dbConnection
      .from<Student>(env.TABLE_STUDENT)
      .where("username", "=", username)
      .first();

    if (!student) return null;

    const studentModel: IStudentModel = {
      hash: student.hash,
      salt: student.salt,
      journals: student.journals,
      name: student.name,
      username: student.username,
    };

    return studentModel;
  }
  async createStudent(student: IStudentModel): Promise<boolean> {
    await dbConnection(env.TABLE_STUDENT).insert({
      username: student.username,
      name: student.name,
      hash: student.hash,
      salt: student.salt,
      journals: student.journals,
    });

    return true;
  }
  async getJournals(username: string): Promise<string[]> {
    const journals = await dbConnection(env.TABLE_STUDENT)
      .where("username", "=", username)
      .select("journals");

    if (!journals) return [];

    return journals;
  }
  async getJournalByTitle(
    username: string,
    title: string
  ): Promise<IJournalModel | null> {
    const journals = await dbConnection
      .select("journals")
      .where("username", "=", username)
      .from<Student>("students");

    for (const journal in journals) {
      if (journal == title) {
        const journalDb = await dbConnection
          .from<Journal>(env.TABLE_JOURNAL)
          .where("publishedfor", "@>", [username])
          .select()
          .first();

        if (!journalDb)
          throw createHttpError(404, `journal with title ${title} not found.`);

        const journalModel: IJournalModel = {
          description: journalDb.desc,
          publishedBy: journalDb.publishedBy,
          publishedFor: journalDb.publishedfor,
          title: journalDb.title,
          imagePath: journalDb.imagepath,
          pdfPath: journalDb.pdfPath,
          publishedAt: journalDb.timestamp,
          url: journalDb.url,
          videoPath: journalDb.videoPath,
        };

        return journalModel;
      }
    }
    return null;
  }
}
