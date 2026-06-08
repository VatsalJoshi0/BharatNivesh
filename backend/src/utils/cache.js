class Cache {
  constructor() {
    this.store = new Map();
  }

  get(key) {
    const item = this.store.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  set(key, value, ttlMs = 60000) {
    this.store.set(key, { value, expiry: Date.now() + ttlMs });
  }

  clear() {
    this.store.clear();
  }
}

export default new Cache();
