import jwt from "jsonwebtoken";
import Message from "../models/message.model.js";
import { WebSocketServer } from "ws";
import fs from "fs";
import path from "path";

const webSocketServerConnection = async (server) => {
    const webSocketServer = new WebSocketServer({ server });
    webSocketServer.on("connection", (connection, req) => {

        const notifyAboutOnlinePeople = () => {
            // notify everyone about online people (when someone connects)
            [...webSocketServer.clients].forEach((client) => {
                client.send(JSON.stringify(
                    {
                        online: [...webSocketServer.clients].map(c => ({ userId: c.userId, username: c.username }))
                    }
                ));
            });
        };

        connection.isAlive = true;

        connection.timer = setInterval(() => {
            connection.ping();
            connection.deathTimer = setTimeout(() => {
                connection.isAlive = false;
                clearInterval(connection.timer);
                connection.terminate();
                notifyAboutOnlinePeople();
            }, 1000);
        }, 4000);

        connection.on("pong", () => {
            clearTimeout(connection.deathTimer);
        });

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
            const { recipient, text, file } = messageData;
            let filename;
            if (recipient && file) {
                const ext = path.extname(file.name);
                filename = `${Date.now()}${ext}`;
                const bufferData = new Buffer(file.data, "base64");
                fs.writeFileSync(`${path.resolve()}/uploads/${filename}`, bufferData);
                const data = fs.readFileSync(`${path.resolve()}/uploads/${filename}`, "utf8");
                console.log(data);
                const messageDoc = await Message.create({
                    sender: connection.userId,
                    recipient,
                    file: file ? file.data : null
                });
                [...webSocketServer.clients]
                    .filter((client) => client.userId === recipient)
                    .forEach(c => c.send(JSON.stringify({
                        file: file ? file.data : null,
                        sender: connection.userId,
                        recipient,
                        _id: messageDoc._id
                    })));
            }
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
                        _id: messageDoc._id
                    })));
            }
        });

        notifyAboutOnlinePeople();

    });

};
export { webSocketServerConnection };