type Entry<T> = { value: T; expires: number };

const stores = new Map<string, Map<string, Entry<unknown>>>();

function getStore(name: string) {
  let store = stores.get(name);
  if (!store) {
    store = new Map();
    stores.set(name, store);
  }
  return store;
}

export function cacheGet<T>(namespace: string, key: string): T | null {
  const store = getStore(namespace);
  const entry = store.get(key);
  if (!entry) return null;
  if (entry.expires < Date.now()) {
    store.delete(key);
    return null;
  }
  return entry.value as T;
}

export function cacheSet<T>(
  namespace: string,
  key: string,
  value: T,
  ttlMs: number,
) {
  const store = getStore(namespace);
  store.set(key, { value, expires: Date.now() + ttlMs });
}

export async function cached<T>(
  namespace: string,
  key: string,
  ttlMs: number,
  fn: () => Promise<T>,
): Promise<T> {
  const hit = cacheGet<T>(namespace, key);
  if (hit !== null) return hit;
  const value = await fn();
  cacheSet(namespace, key, value, ttlMs);
  return value;
}
