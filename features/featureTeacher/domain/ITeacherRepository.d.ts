import { IJournalModel } from "../../../core/data/IJournalModel";
import { ITeacherModel } from "./ITeacherModel";

export type ITeacherRepository = {
  createTeacher(teacher: ITeacherModel): Promise<boolean>;
  deleteTeacher(username: string): Promise<boolean>;
  updateTeacher(teacher: ITeacherModel): Promise<boolean>;
  getTeacherByUsername(username: string): Promise<ITeacherModel | null>;
  // addJournals(journals: [string]): Promise<boolean>;
  removeJournal(title: string): Promise<boolean>;
  updateJournal(journal: IJournalModel): Promise<boolean>;
  createJournal(journal: IJournalModel): Promise<boolean>;
  getJournal(title: string): Promise<IJournalModel | null>;
  getAllJournalsOfTeacher(username: string): Promise<IJournalModel[]>;
};
