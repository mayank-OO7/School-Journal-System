import { Router } from "express";
import { container } from "tsyringe";
import "../../../di/provideDependencies";
import { SignUpController } from "../controllers/SignUpController";
import { SignInController } from "../controllers/SignInController";
const router = Router();

router.post("/signup", container.resolve(SignUpController).signupHandler);

router.post("/signin", container.resolve(SignInController).signinHandler);

export default router;
