import { Router } from "express";
import { CreateJournalController } from "../controllers/CreateJournalController";
import { container } from "tsyringe";
import "../../../../di/provideDependencies";
import { CreateTeacherController } from "../controllers/CreateTeacherController";
import { DeleteTeacherController } from "../controllers/DeleteTeacherController";
import { UpdateTeacherController } from "../controllers/UpdateTeacherController";
import { GetTeacherByUsername } from "../controllers/GetTeacherByUsername";
import { GetJournalController } from "../controllers/GetJournalController";
import { UpdateJournalController } from "../controllers/UpdateJournalController";
import { GetAllJournalsController } from "../controllers/GetAllJournalsController";
import { authMiddleware } from "../../../../core/utils/jwtUtils";
import { validateRole } from "../middlewares/validateRoleMiddleware";

const router = Router();

router.get("/getJournals");

// container.registerSingleton(env.INJECT_ITEACHER_REPOSITORY, TeacherRepository);
const createJournal = container.resolve(CreateJournalController);

router.post(
  "/createJournal",
  authMiddleware,
  // validateRole,
  createJournal.createJournalHandler
);

router.post(
  "/createTeacher",
  // validateRole,
  container.resolve(CreateTeacherController).createJournalHandler
);

router.post(
  "/deleteTeacher",
  authMiddleware,
  // validateRole,
  container.resolve(DeleteTeacherController).deleteTeacherHandler
);

router.post(
  "/updateTeacher",
  authMiddleware,
  // validateRole,
  container.resolve(UpdateTeacherController).updateTeacherHandler
);

router.get(
  "/getTeacher/:username",
  // authMiddleware,
  // validateRole,
  container.resolve(GetTeacherByUsername).getTeacherByUsername
);

router.get(
  "/getJournal",
  authMiddleware,
  // validateRole,
  container.resolve(GetJournalController).getJournalsController
);

router.post(
  "/updateJournal",
  authMiddleware,
  // validateRole,
  container.resolve(UpdateJournalController).updateJournalsController
);

router.get(
  "/getAllJournals",
  authMiddleware,
  // validateRole,
  container.resolve(GetAllJournalsController).getAllJournalsHandler
);

export default router;
