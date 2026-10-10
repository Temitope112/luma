import jwt from "jsonwebtoken";
import { env } from "../config/env";
export const generateToken = (payload) => {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: "7d",
    });
};
export const verifyToken = (token) => {
    return jwt.verify(token, env.JWT_SECRET);
};
