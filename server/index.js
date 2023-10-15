import express from "express";
import userRouter from "./routes/user.routes.js";
import { configDotenv } from "dotenv";
import connectionToDB from "./config/db.config.js";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import messageRouter from "./routes/message.routes.js";
import { webSocketServerConnection } from "./config/webSocket.js";

configDotenv();

connectionToDB();

const port = process.env.PORT || 5001;

const app = express();

app.use("uploads", express.static(`${path.resolve()}/uploads`));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use("/api/user", userRouter);
app.use("/api/messages", messageRouter);

app.get("/", (req, res) => {
    res.json({ message: "working" });
});

const server = app.listen(port);
webSocketServerConnection(server);

