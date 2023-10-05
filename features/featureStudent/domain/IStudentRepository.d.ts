import { IStudentModel } from "./IStudentModel";
import { IJournalModel } from "../../../core/data/IJournalModel";

export type IStudentRepository = {
  createStudent(student: IStudentModel): Promise<boolean>;
  getJournals(username: string): Promise<string[]>;
  getJournalByTitle(
    username: string,
    title: string
  ): Promise<IJournalModel | null>;
  getStudentByUsername(username: string): Promise<IStudentModel | null>;
};
