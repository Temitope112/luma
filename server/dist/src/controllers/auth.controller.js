import { z } from "zod";
import { loginUser, registerUser, } from "../services/auth.service";
import { prisma } from "../utils/prisma";
const registerSchema = z.object({
    firstName: z
        .string()
        .min(2, "First name must be at least 2 characters"),
    lastName: z
        .string()
        .min(2, "Last name must be at least 2 characters"),
    email: z
        .string()
        .email("Please enter a valid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters"),
});
const loginSchema = z.object({
    email: z
        .string()
        .email("Please enter a valid email address"),
    password: z
        .string()
        .min(1, "Password is required"),
});
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};
export const register = async (req, res, next) => {
    try {
        const validatedData = registerSchema.parse(req.body);
        const result = await registerUser(validatedData);
        res.cookie("token", result.token, cookieOptions);
        res.status(201).json({
            success: true,
            message: "Account created successfully",
            user: result.user,
        });
    }
    catch (error) {
        next(error);
    }
};
export const login = async (req, res, next) => {
    try {
        const validatedData = loginSchema.parse(req.body);
        const result = await loginUser(validatedData);
        res.cookie("token", result.token, cookieOptions);
        res.status(200).json({
            success: true,
            message: "Login successful",
            user: result.user,
        });
    }
    catch (error) {
        next(error);
    }
};
export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};
export const getMe = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new Error("Authenticated user not found");
        }
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.userId,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                avatar: true,
                phone: true,
                createdAt: true,
            },
        });
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        next(error);
    }
};
