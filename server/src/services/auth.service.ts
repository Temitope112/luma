import bcrypt from "bcryptjs";
import crypto from "crypto";

import { prisma } from "../utils/prisma";

import { AppError } from "../middleware/error.middleware";

import { generateToken } from "../utils/jwt";

type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

export const registerUser = async (
  data: RegisterInput
) => {
  const normalizedEmail =
    data.email
      .trim()
      .toLowerCase();

  const existingUser =
    await prisma.user.findUnique({
      where: {
        email:
          normalizedEmail,
      },
    });

  if (existingUser) {
    throw new AppError(
      "Email is already registered",
      409
    );
  }

  const hashedPassword =
    await bcrypt.hash(
      data.password,
      12
    );

  const user =
    await prisma.user.create({
      data: {
        firstName:
          data.firstName.trim(),

        lastName:
          data.lastName.trim(),

        email:
          normalizedEmail,

        password:
          hashedPassword,

        role:
          "ATTENDEE",
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

  const token =
    generateToken({
      userId:
        user.id,

      role:
        user.role,
    });

  return {
    user,
    token,
  };
};

export const loginUser = async (
  data: LoginInput
) => {
  const normalizedEmail =
    data.email
      .trim()
      .toLowerCase();

  const user =
    await prisma.user.findUnique({
      where: {
        email:
          normalizedEmail,
      },
    });

  if (!user) {
    throw new AppError(
      "Invalid email or password",
      401
    );
  }

  const isPasswordCorrect =
    await bcrypt.compare(
      data.password,
      user.password
    );

  if (!isPasswordCorrect) {
    throw new AppError(
      "Invalid email or password",
      401
    );
  }

  const token =
    generateToken({
      userId:
        user.id,

      role:
        user.role,
    });

  return {
    user: {
      id:
        user.id,

      firstName:
        user.firstName,

      lastName:
        user.lastName,

      email:
        user.email,

      role:
        user.role,
    },

    token,
  };
};

export const createPasswordResetToken =
  async (email: string) => {
    const normalizedEmail =
      email
        .trim()
        .toLowerCase();

    const user =
      await prisma.user.findUnique({
        where: {
          email:
            normalizedEmail,
        },
      });

    /*
     * Important:
     * We deliberately do not throw if
     * the email does not exist.
     *
     * This prevents account enumeration.
     */
    if (!user) {
      return null;
    }

    const rawToken =
      crypto
        .randomBytes(32)
        .toString("hex");

    const hashedToken =
      crypto
        .createHash(
          "sha256"
        )
        .update(rawToken)
        .digest("hex");

    const expiresAt =
      new Date(
        Date.now() +
          30 *
            60 *
            1000
      );

    await prisma.user.update({
      where: {
        id: user.id,
      },

      data: {
        passwordResetToken:
          hashedToken,

        passwordResetExpires:
          expiresAt,
      },
    });

    return {
      rawToken,
      user,
      expiresAt,
    };
  };

export const resetUserPassword =
  async (
    token: string,
    newPassword: string
  ) => {
    const hashedToken =
      crypto
        .createHash(
          "sha256"
        )
        .update(token)
        .digest("hex");

    const user =
      await prisma.user.findFirst({
        where: {
          passwordResetToken:
            hashedToken,

          passwordResetExpires: {
            gt: new Date(),
          },
        },
      });

    if (!user) {
      throw new AppError(
        "This password reset link is invalid or has expired",
        400
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        12
      );

    await prisma.user.update({
      where: {
        id:
          user.id,
      },

      data: {
        password:
          hashedPassword,

        passwordResetToken:
          null,

        passwordResetExpires:
          null,
      },
    });

    return {
      success: true,
    };
  };