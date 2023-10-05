import { cleanEnv, port, str } from "envalid";

export const env = cleanEnv(process.env, {
  DB_STRING: str(),
  PORT: port(),
  DB_NAME: str(),
  DB_PASSWORD: str(),
  TABLE_TEACHER: str(),
  TABLE_STUDENT: str(),
  TABLE_JOURNAL: str(),
  INJECT_DB: str(),
  INJECT_ITEACHER_REPOSITORY: str(),
  INJECT_ISTUDENT_REPOSITORY: str(),
  DB_HOSTNAME: str(),
  DB_USERNAME: str(),
});
