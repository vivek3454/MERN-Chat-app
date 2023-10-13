import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";

const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: true
};

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
        const hashedPassword = bcrypt.hashSync(password, process.env.SALT);
        const user = await User.create({
            username,
            password: hashedPassword,
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User registration failed, please try again",
            });
        }

        user.password = undefined;

        const token = await jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET);
        res.cookie("chat-app-token", token, cookieOptions);
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

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const isUserExist = await User.findOne({ username });

        if (!isUserExist) {
            return res.status(400).json({
                success: false,
                message: "User not exists",
            });
        }
        else {
            const isPasswordCorrect = await bcrypt.compare(password, isUserExist.password);
            if (isPasswordCorrect) {
                const token = await jwt.sign({ userId: isUserExist._id, username: isUserExist.username }, process.env.JWT_SECRET);
                res.cookie("chat-app-token", token, cookieOptions);

                return res.status(200).json({
                    success: true,
                    message: "User logged in successfully",
                    user: isUserExist
                });
            }
            else {
                return res.status(400).json({
                    success: false,
                    message: "Please enter correct password",
                });
            }
        }

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
const allUsers = async (req, res) => {
    try {
        const users = await User.find({});
        if (users.length > 0) {
            res.status(200).json({
                success: true,
                message: "All Users",
                users
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export { register, login, profile, allUsers };