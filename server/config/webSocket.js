import jwt from "jsonwebtoken";
import Message from "../models/message.model.js";
import { WebSocketServer } from "ws";

const webSocketServerConnection = async (server) => {
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
                        _id: messageDoc._id
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
};
export { webSocketServerConnection };