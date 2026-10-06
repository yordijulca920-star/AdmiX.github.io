/**
 * Local persistence adapter.
 * Today: zustand + localStorage (`admix-local-v1`).
 * Tomorrow: swap this module for a cloud sync implementation
 * (pull/push JSON snapshots) without rewriting screens.
 */

export const LOCAL_DB_KEY = "admix-local-v1";

export interface SyncAdapter<T> {
  load(): T | null;
  save(state: T): void;
  /** Reserved for remote sync. */
  pull?(): Promise<T | null>;
  push?(state: T): Promise<void>;
}

export function localStorageAdapter<T>(key: string): SyncAdapter<T> {
  return {
    load() {
      if (typeof window === "undefined") return null;
      try {
        const raw = window.localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : null;
      } catch {
        return null;
      }
    },
    save(state) {
      if (typeof window === "undefined") return;
      window.localStorage.setItem(key, JSON.stringify(state));
    },
    async pull() {
      return this.load();
    },
    async push(state) {
      this.save(state);
    },
  };
}
