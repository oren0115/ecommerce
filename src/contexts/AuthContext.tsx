import React, { createContext, useContext, useEffect, useState } from "react";
import { authAPI } from "../api/api";
import {
  AuthContextType,
  User,
  LoginCredentials,
  RegisterCredentials,
} from "../types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on app load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Verify token with backend
          const response = await authAPI.getProfile();
          if ((response.data as any)?.success) {
            setUser((response.data as any)?.data);
            localStorage.setItem(
              "user",
              JSON.stringify((response.data as any)?.data)
            );
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setToken(null);
            setUser(null);
          }
        } catch (error) {
          console.error("Auth initialization error:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { user, token } = (response.data as any)?.data;

      setUser(user);
      setToken(token);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error: any) {
      const message =
        error.response?.data?.error?.detail?.message || "Login failed";
      throw new Error(message);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      const response = await authAPI.register(credentials);
      const { user } = (response.data as any)?.data;

      // Return user info for activation flow instead of auto-login
      return {
        email: user.email,
        fullname: user.fullname,
      };
    } catch (error: any) {
      const message =
        error.response?.data?.error?.detail?.message || "Registration failed";
      throw new Error(message);
    }
  };

  const activateAccount = async (token: string) => {
    try {
      const response = await authAPI.activateAccount(token);
      const { user, token: authToken } = (response.data as any)?.data;

      setUser(user);
      setToken(authToken);
      localStorage.setItem("token", authToken);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error: any) {
      const message =
        error.response?.data?.error?.detail?.message ||
        "Account activation failed";
      throw new Error(message);
    }
  };

  const resendActivation = async (email: string) => {
    try {
      await authAPI.resendActivation(email);
    } catch (error: any) {
      const message =
        error.response?.data?.error?.detail?.message ||
        "Failed to resend activation email";
      throw new Error(message);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await authAPI.updateProfile(data);
      const updatedUser = (response.data as any)?.data;

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error: any) {
      const message =
        error.response?.data?.error?.detail?.message || "Profile update failed";
      throw new Error(message);
    }
  };

  const updatePassword = async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    try {
      const response = await authAPI.updatePassword(data);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.error?.detail?.message ||
        "Password update failed";
      throw new Error(message);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    register,
    activateAccount,
    resendActivation,
    logout,
    updateProfile,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
