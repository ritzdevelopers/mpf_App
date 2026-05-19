import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const STORAGE_KEY = "mpf_recent_views_ids";
const MAX_RECENT_ITEMS = 10; // Cap the history limit to 10 items

let recentIds: number[] = [];
const listeners = new Set<(ids: number[]) => void>();

/** Load saved recent property IDs from phone storage on app launch */
export async function hydrateRecentViews() {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json) {
      recentIds = JSON.parse(json);
      notify();
    }
  } catch (e) {
    console.warn("[recentViewsStore] load failed:", e);
  }
}

function notify() {
  const current = [...recentIds];
  listeners.forEach((l) => l(current));
}

/** Track a newly viewed property ID */
export async function addRecentView(id: number) {
  if (!id) return;

  // Remove the ID if it's already in the list to avoid duplicates
  recentIds = recentIds.filter((item) => item !== id);

  // Add the new ID to the FRONT of the array (most recent first)
  recentIds.unshift(id);

  // Cap the array length to the maximum limit
  if (recentIds.length > MAX_RECENT_ITEMS) {
    recentIds = recentIds.slice(0, MAX_RECENT_ITEMS);
  }

  notify();

  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(recentIds));
  } catch (e) {
    console.warn("[recentViewsStore] save failed:", e);
  }
}

/** Allow the user to wipe their history */
export async function clearRecentViews() {
  recentIds = [];
  notify();
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn("[recentViewsStore] clear failed:", e);
  }
}

/** Hook to let components reactive-listen to the list of recent IDs */
export function useRecentViews(): number[] {
  const [ids, setIds] = useState<number[]>(recentIds);

  useEffect(() => {
    const unsub = subscribe((next) => setIds(next));
    return unsub;
  }, []);

  return ids;
}

export function subscribe(fn: (ids: number[]) => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
