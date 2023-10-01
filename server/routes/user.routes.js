import { Router } from "express";
import { profile, register } from "../controllers/user.controller.js";

const userRouter = Router();

// create account
userRouter.post("/register", register);
userRouter.post("/profile", profile);

export default userRouter;