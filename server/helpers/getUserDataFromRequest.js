import jwt from "jsonwebtoken";

const getUserDataFromRequest = async (req) => {
    const token = req.cookies["chat-app-token"];
    if (token) {
        return await jwt.verify(token, process.env.JWT_SECRET);
    }
};

export default getUserDataFromRequest;