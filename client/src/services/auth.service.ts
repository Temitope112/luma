import axios from "axios";

import { api } from "@/lib/api";

import type {
  AuthResponse,
  User,
} from "@/types/auth";

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
  const response =
    await api.post<AuthResponse>(
      "/auth/register",
      data
    );

  return response.data;
};

export const loginUser = async (
  data: LoginInput
) => {
  const response =
    await api.post<AuthResponse>(
      "/auth/login",
      data
    );

  return response.data;
};

export const logoutUser = async () => {
  const response =
    await api.post("/auth/logout");

  return response.data;
};

export const getCurrentUser =
  async (): Promise<User | null> => {
    try {
      const response =
        await api.get<{
          success: boolean;
          user: User | null;
        }>("/auth/me");

      return response.data.user;
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response?.status === 401
      ) {
        return null;
      }

      throw error;
    }
  };

  export const forgotPassword =
  async (
    email: string
  ) => {
    const response =
      await api.post<{
        success: boolean;
        message: string;
      }>(
        "/auth/forgot-password",
        {
          email,
        }
      );

    return response.data;
  };

export const resetPassword =
  async (
    token: string,
    password: string
  ) => {
    const response =
      await api.post<{
        success: boolean;
        message: string;
      }>(
        "/auth/reset-password",
        {
          token,
          password,
        }
      );

    return response.data;
  };