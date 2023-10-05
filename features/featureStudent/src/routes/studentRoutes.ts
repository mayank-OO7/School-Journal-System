import { Router } from "express";
import { container } from "tsyringe";
import { authMiddleware } from "../../../../core/utils/jwtUtils";
import "../../../../di/provideDependencies";
import { CreateStudentController } from "../controllers/CreateStudentController";
import { GetJournalsController } from "../controllers/GetJournalsController";
const router = Router();

// router.post(
//   "/createStudent",
//   container.resolve(CreateStudentController).createStudentHandler
// );

router.get(
  "/getJournal",
  authMiddleware,
  container.resolve(GetJournalsController).getJournalsHandler
);

router.get(
  "/getJournalByTitle",
  authMiddleware,
  container.resolve(GetJournalsController).getJournalsHandler
);

export default router;
