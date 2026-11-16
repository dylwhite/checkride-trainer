// All progress lives on this iPhone in IndexedDB. Nothing is sent anywhere.
import { get, set } from 'idb-keyval';

export async function load<T>(key: string, fallback: T): Promise<T> {
  try {
    const v = await get<T>(key);
    return v === undefined ? fallback : v;
  } catch {
    return fallback;
  }
}

export async function save<T>(key: string, value: T): Promise<void> {
  try {
    await set(key, value);
  } catch {
    /* storage unavailable (e.g. private browsing) — app still works for this session */
  }
}

// Ask iOS to keep our data even when the phone is low on space.
export async function requestPersistence(): Promise<boolean> {
  try {
    if (navigator.storage?.persist) return await navigator.storage.persist();
  } catch {
    /* ignore */
  }
  return false;
}
