import bcrypt from "bcryptjs";
import { prisma } from "../utils/prisma";
import { AppError } from "../middleware/error.middleware";
import { generateToken } from "../utils/jwt";
export const registerUser = async (data) => {
    const existingUser = await prisma.user.findUnique({
        where: {
            email: data.email.toLowerCase(),
        },
    });
    if (existingUser) {
        throw new AppError("Email is already registered", 409);
    }
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
        data: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email.toLowerCase(),
            password: hashedPassword,
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });
    const token = generateToken({
        userId: user.id,
        role: user.role,
    });
    return {
        user,
        token,
    };
};
export const loginUser = async (data) => {
    const user = await prisma.user.findUnique({
        where: {
            email: data.email.toLowerCase(),
        },
    });
    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }
    const isPasswordCorrect = await bcrypt.compare(data.password, user.password);
    if (!isPasswordCorrect) {
        throw new AppError("Invalid email or password", 401);
    }
    const token = generateToken({
        userId: user.id,
        role: user.role,
    });
    return {
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        },
        token,
    };
};
