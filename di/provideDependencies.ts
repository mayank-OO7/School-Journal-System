import "reflect-metadata";
import { container } from "tsyringe";
import { env } from "../core/utils/envalidUtils";
import * as _knex from "knex";
import dbConnection from "../core/data/database/connection/knexDbConnection";
import { ITeacherRepository } from "../features/featureTeacher/domain/ITeacherRepository";
import { TeacherRepository } from "../features/featureTeacher/data/TeacherRepository";
import { IStudentRepository } from "../features/featureStudent/domain/IStudentRepository";
import { StudentRepository } from "../features/featureStudent/data/StudentRepository";

container.register<_knex.Knex>(env.INJECT_DB, { useValue: dbConnection });

container.registerSingleton<ITeacherRepository>(
  env.INJECT_ITEACHER_REPOSITORY,
  TeacherRepository
);

container.registerSingleton<IStudentRepository>(
  env.INJECT_ISTUDENT_REPOSITORY,
  StudentRepository
);
