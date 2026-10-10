"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { User } from "@/types/auth";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "@/services/auth.service";

type LoginInput = {
  email: string;
  password: string;
};

type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;

  login: (
    data: LoginInput
  ) => Promise<User>;

  register: (
    data: RegisterInput
  ) => Promise<User>;

  logout: () => Promise<void>;

  refreshUser: () => Promise<void>;
};

const AuthContext =
  createContext<AuthContextType | null>(
    null
  );

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  const refreshUser = async () => {
    const currentUser =
      await getCurrentUser();

    setUser(currentUser);
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        await refreshUser();
      } catch (error) {
        console.error(
          "Failed to restore session:",
          error
        );

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (
    data: LoginInput
  ) => {
    const response =
      await loginUser(data);

    setUser(response.user);

    return response.user;
  };

  const register = async (
    data: RegisterInput
  ) => {
    const response =
      await registerUser(data);

    setUser(response.user);

    return response.user;
  };

  const logout = async () => {
    await logoutUser();

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};