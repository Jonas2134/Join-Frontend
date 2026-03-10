import { afterEach, beforeEach } from "vitest";

// Provide a minimal localStorage polyfill if happy-dom doesn't have one
if (typeof globalThis.localStorage === "undefined" || !globalThis.localStorage.getItem) {
  const store: Record<string, string> = {};
  globalThis.localStorage = {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { for (const key of Object.keys(store)) delete store[key]; },
    get length() { return Object.keys(store).length; },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  document.body.innerHTML = "";
  document.head.innerHTML = "";
});
