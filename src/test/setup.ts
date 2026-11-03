import '@testing-library/jest-dom';

// Node 25 ships its own localStorage global. Without --localstorage-file it is an empty object
// with no methods, and it shadows jsdom's, so localStorage.clear() throws. Swap in a working one.
if (typeof globalThis.localStorage?.clear !== 'function') {
  const items = new Map<string, string>();

  const storage: Storage = {
    get length() {
      return items.size;
    },
    clear: () => items.clear(),
    getItem: (key) => items.get(key) ?? null,
    key: (index) => Array.from(items.keys())[index] ?? null,
    removeItem: (key) => {
      items.delete(key);
    },
    setItem: (key, value) => {
      items.set(key, String(value));
    },
  };

  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: storage });
}
