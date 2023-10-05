import "reflect-metadata";
import "dotenv/config";
import express from "express";
import dbConnection from "./core/data/database/connection/knexDbConnection";
import { logger } from "./core/utils/winstonLogger";
import { TableHandler } from "./core/data/database/connection/createTables/TableHandler";
import TeacherRouter from "./features/featureTeacher/src/routes/teacherRoutes";
import createHttpError, { isHttpError } from "http-errors";
import { Request, Response, NextFunction } from "express";
import "./di/provideDependencies";
import AuthRouter from "./features/featureAuthentication/routes/authenticationRoutes";
import StudentRouter from "./features/featureStudent/src/routes/studentRoutes";

const app = express();

const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/teacher", TeacherRouter);
app.use("/student", StudentRouter);
app.use("/auth", AuthRouter);

app.get("/", async (req, res, next) => {
  return res.status(200).json({ success: true });
});

app.use((_req, _res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  logger.error(error);
  let errorMessage = "An unknown error occurred.";
  let statusCode = 500;

  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  return res.status(statusCode).json({ success: false, message: errorMessage });
});

try {
  app.listen(port, async () => {
    logger.log({
      message: `server up on http://localhost:${port}`,
      level: "info",
    });
  });
  //   await connectToDatabase(env.DB_NAME);
  const tableHandler = new TableHandler(dbConnection);
  tableHandler.createTeacherTable();
  tableHandler.createJournalTable();
  tableHandler.createStudentTable();
} catch (error) {
  logger.error(`error occurred while starting the server.\n${error}`);
}
