import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const userExist = await User.findOne({ username });

        if (userExist) {
            return res.status(400).json({
                success: false,
                message: "Username already exists",
            });
        }

        const user = await User.create({
            username,
            password,
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User registration failed, please try again",
            });
        }

        user.password = undefined;

        const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        res.cookie("chat-app-token", token);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const profile = async (req, res) => {
    const token = req.cookies["chat-app-token"];
    if (token) {
        const userData = await jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({
            success: true,
            message: "User profile",
            userData
        });
    }
};

export { register, profile };