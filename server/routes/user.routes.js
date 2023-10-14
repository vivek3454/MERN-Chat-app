import { Router } from "express";
import { login, profile, register, allUsers, logout } from "../controllers/user.controller.js";

const userRouter = Router();

// create account
userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.get("/profile", profile);
userRouter.get("/allusers", allUsers);

export default userRouter;