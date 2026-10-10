import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { z } from "zod";

import {
  createPasswordResetToken,
  loginUser,
  registerUser,
  resetUserPassword,
} from "../services/auth.service.js";

import {
  sendPasswordResetEmail,
} from "../services/email.service.js";

import { prisma } from "../utils/prisma.js";

import type {
  AuthenticatedRequest,
} from "../middleware/auth.middleware.js";

const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(
        2,
        "First name must be at least 2 characters"
      ),

    lastName: z
      .string()
      .trim()
      .min(
        2,
        "Last name must be at least 2 characters"
      ),

    email: z
      .string()
      .trim()
      .email(
        "Please enter a valid email address"
      ),

    password: z
      .string()
      .min(
        8,
        "Password must be at least 8 characters"
      ),
  })
  .strict();

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email(
      "Please enter a valid email address"
    ),

  password: z
    .string()
    .min(
      1,
      "Password is required"
    ),
});

const forgotPasswordSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email(
        "Please enter a valid email address"
      ),
  })
  .strict();

const resetPasswordSchema = z
  .object({
    token: z
      .string()
      .min(
        1,
        "Reset token is required"
      ),

    password: z
      .string()
      .min(
        8,
        "Password must be at least 8 characters"
      ),
  })
  .strict();

const isProduction =
  process.env.NODE_ENV ===
  "production";

const cookieOptions = {
  httpOnly: true,

  secure:
    isProduction,

  sameSite:
    isProduction
      ? ("none" as const)
      : ("lax" as const),

  maxAge:
    7 *
    24 *
    60 *
    60 *
    1000,
};

const clearCookieOptions = {
  httpOnly: true,

  secure:
    isProduction,

  sameSite:
    isProduction
      ? ("none" as const)
      : ("lax" as const),
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData =
      registerSchema.parse(
        req.body
      );

    const result =
      await registerUser(
        validatedData
      );

    res.cookie(
      "token",
      result.token,
      cookieOptions
    );

    res.status(201).json({
      success: true,
      message:
        "Account created successfully",
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData =
      loginSchema.parse(
        req.body
      );

    const result =
      await loginUser(
        validatedData
      );

    res.cookie(
      "token",
      result.token,
      cookieOptions
    );

    res.status(200).json({
      success: true,
      message:
        "Login successful",
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response
) => {
  res.clearCookie(
    "token",
    clearCookieOptions
  );

  res.status(200).json({
    success: true,
    message:
      "Logged out successfully",
  });
};

export const getMe = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      res.status(200).json({
        success: true,
        user: null,
      });

      return;
    }

    const user =
      await prisma.user.findUnique({
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
      res.clearCookie(
        "token",
        clearCookieOptions
      );

      res.status(200).json({
        success: true,
        user: null,
      });

      return;
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } =
        forgotPasswordSchema.parse(
          req.body
        );

      const result =
        await createPasswordResetToken(
          email
        );

      if (result) {
        const clientUrl =
          process.env.CLIENT_URL ??
          "http://localhost:3000";

        const resetUrl =
          `${clientUrl}/reset-password?token=${encodeURIComponent(
            result.rawToken
          )}`;

        try {
          await sendPasswordResetEmail({
            email:
              result.user.email,

            firstName:
              result.user.firstName,

            resetUrl,
          });
        } catch (emailError) {
          console.error(
            "Password reset email error:",
            emailError
          );
        }
      }

      res.status(200).json({
        success: true,

        message:
          "Your password reset request has been received.",
      });
    } catch (error) {
      next(error);
    }
  };

export const resetPassword =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {
        token,
        password,
      } =
        resetPasswordSchema.parse(
          req.body
        );

      await resetUserPassword(
        token,
        password
      );

      res.clearCookie(
        "token",
        clearCookieOptions
      );

      res.status(200).json({
        success: true,

        message:
          "Your password has been reset successfully.",
      });
    } catch (error) {
      next(error);
    }
  };