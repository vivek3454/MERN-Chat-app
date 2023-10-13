import { Router } from "express";
import { getSelectedUsersmessages, createmessage, deletemessage } from "../controllers/message.controller.js";

const messageRouter = Router();

// create account
messageRouter.post("/createmessage", createmessage);
messageRouter.delete("/:messageId", deletemessage);
messageRouter.get("/:userId", getSelectedUsersmessages);

export default messageRouter;