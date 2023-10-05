import { Knex } from "knex";
import { env } from "../../../../utils/envalidUtils";
import { logger } from "../../../../utils/winstonLogger";

export class TableHandler {
  constructor(private dbConnection: Knex) {}

  createJournalTable() {
    const journalTable = env.TABLE_JOURNAL;

    this.dbConnection.schema
      .hasTable(journalTable)
      .then((exist) => {
        if (!exist) {
          this.dbConnection.schema
            .createTable(journalTable, (table) => {
              table.increments("id").primary();
              table.string("desc").notNullable();
              table.string("title").notNullable();
              table.string("publishedBy").notNullable();
              table.foreign("publishedBy").references("teacherTable.username");
              table.specificType("publishedfor", "text ARRAY").notNullable();
              table
                .timestamp("publishedAt")
                .notNullable()
                .defaultTo(this.dbConnection.raw("CURRENT_TIMESTAMP"));
              table.string("videoPath").nullable().defaultTo(null);
              table.string("imagePath").nullable().defaultTo(null);
              table.string("pdfPath").nullable().defaultTo(null);
              table.string("url").nullable().defaultTo(null);
            })
            .then(() => {
              logger.info("successfully created Journal Table");
            })
            .catch((error) => {
              logger.error(JSON.stringify(error));
            });
        }
      })
      .catch((error) => {
        logger.error(
          `Unable to create Journal Database\n${JSON.stringify(error)}`
        );
      });
  }

  createStudentTable() {
    const studentTable = env.TABLE_STUDENT;

    this.dbConnection.schema
      .hasTable(studentTable)
      .then((exist) => {
        if (!exist) {
          this.dbConnection.schema
            .createTable(studentTable, (table) => {
              table.increments("id").primary();
              table.string("username").unique().notNullable();
              table.string("name").notNullable();
              table.string("hash").notNullable();
              table.string("salt").notNullable();
              table.specificType("journals", "text ARRAY").notNullable();
            })
            .then(() => {
              logger.info("successfully created student Table");
            })
            .catch((error) => {
              logger.error(`error occurred ${JSON.stringify(error)}`);
            });
        }
      })
      .catch((error) => {
        logger.error(JSON.stringify(error));
      });
  }

  createTeacherTable = () => {
    const teacherTable = env.TABLE_TEACHER;

    this.dbConnection.schema
      .hasTable(teacherTable)
      .then((exist) => {
        if (!exist) {
          this.dbConnection.schema
            .createTable(teacherTable, (table) => {
              table.increments("id").primary();
              table.string("username").unique().notNullable();
              table.string("name").notNullable();
              table.string("hash").notNullable();
              table.string("salt").notNullable();
              table
                .specificType("journals", "text ARRAY")
                .notNullable()
                .defaultTo("{}");
            })
            .then(() => {
              logger.info("successfully created Teachers Table");
            })
            .catch((error) => {
              logger.error(JSON.stringify(error));
            });
        }
      })
      .catch((error) => {
        logger.error(JSON.stringify(error));
      });
  };
}
