import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const STORAGE_KEY = "mpf_favorites_ids";
let favoriteIds: Set<number> = new Set();
const listeners = new Set<(ids: Set<number>) => void>();

/** Load saved favorites from phone disk into memory on app start */
export async function hydrateFavorites() {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json) {
      const arr = JSON.parse(json);
      favoriteIds = new Set(arr);
      notify();
    }
  } catch (e) {
    console.warn("[favoritesStore] load failed:", e);
  }
}

function notify() {
  const current = new Set(favoriteIds);
  listeners.forEach((l) => l(current));
}

/** Toggle a property in the saved list */
export async function toggleFavorite(id: number) {
  if (!id) return;
  
  if (favoriteIds.has(id)) {
    favoriteIds.delete(id);
  } else {
    favoriteIds.add(id);
  }
  
  notify();
  
  try {
    await AsyncStorage.setItem(
      STORAGE_KEY, 
      JSON.stringify(Array.from(favoriteIds))
    );
  } catch (e) {
    console.warn("[favoritesStore] save failed:", e);
  }
}

/** Synchronous check if an ID is favorited */
export function isFavorite(id: number): boolean {
  return favoriteIds.has(id);
}

/** Hook to listen for favorite changes in any component */
export function useFavorites(): Set<number> {
  const [ids, setIds] = useState<Set<number>>(new Set(favoriteIds));

  useEffect(() => {
    const unsub = subscribe((next) => setIds(next));
    return unsub;
  }, []);

  return ids;
}

export function subscribe(fn: (ids: Set<number>) => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
