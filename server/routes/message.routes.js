import { Router } from "express";
import { getSelectedUsersmessages, createmessage } from "../controllers/message.controller.js";

const messageRouter = Router();

// create account
messageRouter.post("/createmessage", createmessage);
messageRouter.get("/:userId", getSelectedUsersmessages);

export default messageRouter;