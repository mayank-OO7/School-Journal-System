export interface ITeacherModel {
  username: string;
  hash: string;
  salt: string;
  name: string;
  journals: string[];
}
