import { Router } from "express";
import { register } from "../controllers/user.controller.js";

const userRouter = Router();

// create account
userRouter.post("/register", register);

export default userRouter;