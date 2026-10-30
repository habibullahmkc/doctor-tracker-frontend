import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { Admin } from "@/types/auth";
import type { LoginInput } from "@/validations/auth.schema";

export const authService = {
  login: (body: LoginInput) =>
    api<ApiResponse<Admin>>("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  logout: () => api<void>("/auth/logout", { method: "POST" }),
  me: () => api<ApiResponse<Admin>>("/auth/me"),
};
