"use no memo";

import type { LoginResponse } from "@/types/auth";
import * as SecureStore from "expo-secure-store";
import { logoutRequest } from "@/services/authApi";
import { useEffect, useState } from "react";

export type User = {
  id?: number;
  name: string;
  email: string;
  phone?: string;
};

const STORAGE_USER = "mpf_auth_user_json";
const STORAGE_ACCESS = "mpf_access_token";
const STORAGE_REFRESH = "mpf_refresh_token";

function mapUser(u: LoginResponse["user"]): User {
  const name =
    u.fullName?.trim() ||
    u.email.split("@")[0]?.replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) ||
    u.email;

  const out: User = { name, email: u.email.trim().toLowerCase() };
  if (typeof u.id === "number") out.id = u.id;
  if (u.phone) out.phone = u.phone.trim();
  return out;
}

let accessTokenMemory: string | null = null;
let refreshTokenMemory: string | null = null;

let currentUser: User | null = null;

const listeners = new Set<(u: User | null) => void>();

export function getAccessToken(): string | null {
  return accessTokenMemory;
}

export function getRefreshToken(): string | null {
  return refreshTokenMemory;
}

export function getUser(): User | null {
  return currentUser;
}

function notifyListeners() {
  Array.from(listeners).forEach((l) => {
    try {
      l(currentUser);
    } catch (e) {
      console.warn("[authStore] listener error:", e);
    }
  });
}

export async function applyLoginResponse(login: LoginResponse): Promise<void> {
  accessTokenMemory = login.token;
  refreshTokenMemory = login.refreshToken;
  currentUser = mapUser(login.user);

  await SecureStore.setItemAsync(STORAGE_ACCESS, login.token);
  await SecureStore.setItemAsync(STORAGE_REFRESH, login.refreshToken);
  await SecureStore.setItemAsync(STORAGE_USER, JSON.stringify(currentUser));

  notifyListeners();
}

/** Overwrite tokens after POST /auth/refresh */
export async function applyTokenRefresh(login: Partial<Pick<LoginResponse, "token" | "refreshToken">>): Promise<void> {
  if (login.token != null) {
    accessTokenMemory = login.token;
    await SecureStore.setItemAsync(STORAGE_ACCESS, login.token);
  }
  if (login.refreshToken != null) {
    refreshTokenMemory = login.refreshToken;
    await SecureStore.setItemAsync(STORAGE_REFRESH, login.refreshToken);
  }
}

export async function clearLocalSession(): Promise<void> {
  accessTokenMemory = null;
  refreshTokenMemory = null;
  currentUser = null;
  await Promise.all([
    SecureStore.deleteItemAsync(STORAGE_ACCESS).catch(() => null),
    SecureStore.deleteItemAsync(STORAGE_REFRESH).catch(() => null),
    SecureStore.deleteItemAsync(STORAGE_USER).catch(() => null),
  ]);
  notifyListeners();
}

/** Load tokens + user from secure storage into memory */
export async function hydrateSession(): Promise<void> {
  try {
    const [access, refresh, userJson] = await Promise.all([
      SecureStore.getItemAsync(STORAGE_ACCESS),
      SecureStore.getItemAsync(STORAGE_REFRESH),
      SecureStore.getItemAsync(STORAGE_USER),
    ]);
    if (access && refresh && userJson) {
      accessTokenMemory = access;
      refreshTokenMemory = refresh;
      try {
        currentUser = JSON.parse(userJson) as User;
      } catch {
        currentUser = null;
        await clearLocalSession();
        return;
      }
      notifyListeners();
    }
  } catch (e) {
    console.warn("[authStore] hydrate failed:", e);
  }
}

export async function signOut(): Promise<void> {
  const t = accessTokenMemory;
  if (t) {
    await logoutRequest(t);
  }
  await clearLocalSession();
}

export function subscribe(fn: (u: User | null) => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function useUser(): User | null {
  const [user, setLocalUser] = useState<User | null>(() => currentUser);

  useEffect(() => {
    if (user !== currentUser) setLocalUser(currentUser);

    const unsub = subscribe((u) => setLocalUser(u));
    return unsub;
  }, []);

  return user;
}
