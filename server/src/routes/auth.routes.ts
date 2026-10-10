import { Router } from "express";

import {
  forgotPassword,
  getMe,
  login,
  logout,
  register,
  resetPassword,
} from "../controllers/auth.controller";



import {
  optionalAuth,
} from "../middleware/auth.middleware";

import {
  forgotPasswordLimiter,
  resetPasswordLimiter,
} from "../middleware/rate-limit.middleware";

const router =
  Router();

router.post(
  "/register",
  register
);

router.post(
  "/login",
  login
);

router.post(
  "/logout",
  logout
);

router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  forgotPassword
);

router.post(
  "/reset-password",
  resetPasswordLimiter,
  resetPassword
);

router.get(
  "/me",
  optionalAuth,
  getMe
);

export default router;