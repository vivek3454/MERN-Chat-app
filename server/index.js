import express from "express";
import userRouter from "./routes/user.routes.js";
import { configDotenv } from "dotenv";
import connectionToDB from "./config/db.config.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import Message from "./models/message.model.js";

configDotenv();

connectionToDB();

const port = process.env.PORT || 5001;

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

const server = app.listen(port);

const webSocketServer = new WebSocketServer({ server });
webSocketServer.on("connection", (connection, req) => {
    // read username and id from the cookie for this connection
    const cookies = req.headers.cookie;
    if (cookies) {
        const tokenCookieString = cookies.split("; ").find(str => str.startsWith("chat-app-token="));
        if (tokenCookieString) {
            const token = tokenCookieString.split("=")[1];
            if (token) {
                const { userId, username } = jwt.verify(token, process.env.JWT_SECRET);
                connection.userId = userId;
                connection.username = username;
            }
        }
    }

    connection.on("message", async (message) => {
        const messageData = JSON.parse(message.toString());
        const { recipient, text } = messageData;
        if (recipient && text) {
            const messageDoc = await Message.create({
                sender: connection.userId,
                recipient,
                text
            });

            [...webSocketServer.clients]
                .filter((client) => client.userId === recipient)
                .forEach(c => c.send(JSON.stringify({
                    text,
                    sender: connection.userId,
                    recipient,
                    id: messageDoc._id
                })));
        }
    });

    // notify everyone about online people (when someone connects)
    [...webSocketServer.clients].forEach((client) => {
        client.send(JSON.stringify(
            {
                online: [...webSocketServer.clients].map(c => ({ userId: c.userId, username: c.username }))
            }
        ));
    });
});

