import axios, { AxiosError } from "axios";
import type { LoginResponse, RefreshResponse } from "@/types/auth";
import { API_BASE_URL } from "@/constants/apiBase";

/** No Bearer added — used for login, signup, refresh to avoid interceptor loops */
const bare = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
  const { data } = await bare.post<LoginResponse>("/auth/login", {
    email: email.toLowerCase().trim(),
    password,
  });
  return data;
}

export async function signupRequest(params: {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
}): Promise<LoginResponse> {
  const body: Record<string, string> = {
    fullName: params.fullName.trim(),
    email: params.email.toLowerCase().trim(),
    password: params.password,
  };
  const phone = params.phone?.trim();
  if (phone) body.phone = phone;

  const { data } = await bare.post<LoginResponse>("/auth/signup", body);
  return data;
}

export async function refreshRequest(refreshToken: string): Promise<RefreshResponse> {
  const { data } = await bare.post<RefreshResponse>("/auth/refresh", { refreshToken });
  return data;
}

export async function forgotPasswordRequest(email: string): Promise<void> {
  await bare.post("/auth/forgot-password", { email: email.toLowerCase().trim() });
}

export async function resetPasswordRequest(token: string, newPassword: string): Promise<void> {
  await bare.post("/auth/reset-password", { token: token.trim(), newPassword });
}

export async function logoutRequest(accessToken: string): Promise<void> {
  try {
    await bare.post(
      "/auth/logout",
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
  } catch {
    // Best-effort; local session is always cleared afterward
  }
}

export function getApiErrorMessage(err: unknown): string {
  const ax = err as AxiosError<{ message?: string }>;
  const msg =
    ax?.response?.data && typeof ax.response.data === "object"
      ? (ax.response.data as { message?: string }).message
      : undefined;
  if (typeof msg === "string" && msg.trim()) return msg;
  if (err instanceof Error && err.message) return err.message;
  return "Something went wrong. Please try again.";
}
