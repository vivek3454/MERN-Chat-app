import { Router } from "express";
import { login, profile, register } from "../controllers/user.controller.js";

const userRouter = Router();

// create account
userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/profile", profile);

export default userRouter;