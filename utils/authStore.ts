"use no memo";
// utils/authStore.ts
// Tiny in-memory auth store. Swap with real API / AsyncStorage later.
import { useEffect, useState } from "react";

export type User = {
  name: string;
  email: string;
  phone?: string;
};

let currentUser: User | null = null;
const listeners = new Set<(u: User | null) => void>();

export function getUser(): User | null {
  return currentUser;
}

export function setUser(u: User | null) {
  currentUser = u;
  // Copy listeners before iterating so mutations during notify don't break it
  Array.from(listeners).forEach((l) => {
    try {
      l(u);
    } catch (e) {
      // Swallow listener errors so one bad subscriber can't break the rest
      console.warn("[authStore] listener error:", e);
    }
  });
}

export function signOut() {
  setUser(null);
}

export function subscribe(fn: (u: User | null) => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/**
 * Stable React Native hook that returns the current user and re-renders
 * on changes. Uses useState+useEffect (not useSyncExternalStore) for
 * compatibility with Hermes and React Native's render loop.
 */
export function useUser(): User | null {
  const [user, setLocalUser] = useState<User | null>(() => currentUser);

  useEffect(() => {
    // Sync once immediately after mount in case the module state changed
    // between the lazy initial state and the effect running.
    if (user !== currentUser) setLocalUser(currentUser);

    const unsub = subscribe((u) => setLocalUser(u));
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return user;
}
