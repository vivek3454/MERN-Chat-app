import express from "express";
import userRouter from "./routes/user.routes.js";
import { configDotenv } from "dotenv";
import connectionToDB from "./config/db.config.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

configDotenv();

connectionToDB();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use("/api/user", userRouter);

app.get("/", (req, res) => {
    res.json({ message: "working" });
});

app.listen(5000, () => {
    console.log("listening");
});
