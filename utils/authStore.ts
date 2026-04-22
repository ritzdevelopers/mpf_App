// utils/authStore.ts
// Tiny in-memory auth store. Swap with real API / AsyncStorage later.
import { useSyncExternalStore } from "react";

export type User = {
  name: string;
  email: string;
  phone?: string;
};

let currentUser: User | null = null;
const listeners = new Set<() => void>();

export function getUser(): User | null {
  return currentUser;
}

export function setUser(u: User | null) {
  currentUser = u;
  listeners.forEach((l) => l());
}

export function signOut() {
  setUser(null);
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function useUser(): User | null {
  return useSyncExternalStore(subscribe, getUser, getUser);
}
