import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { prisma } from "../utils/prisma.js";

export const promoteUserToOrganizer =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {
        secret,
        email,
      } = req.body;

      const adminSecret =
        process.env.DEV_ADMIN_SECRET;

      if (
        !adminSecret ||
        secret !== adminSecret
      ) {
        res.status(401).json({
          message: "Unauthorized",
        });

        return;
      }

      if (!email) {
        res.status(400).json({
          message:
            "Email is required",
        });

        return;
      }

      const user =
        await prisma.user.findUnique({
          where: {
            email,
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        });

      if (!user) {
        res.status(404).json({
          message:
            "User not found",
        });

        return;
      }

      if (
        user.role ===
        "ORGANIZER"
      ) {
        res.status(200).json({
          message:
            "User is already an organizer",
          user,
        });

        return;
      }

      const updatedUser =
        await prisma.user.update({
          where: {
            id: user.id,
          },

          data: {
            role: "ORGANIZER",
          },

          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        });

      res.status(200).json({
        message:
          "User promoted successfully",
        user: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  };