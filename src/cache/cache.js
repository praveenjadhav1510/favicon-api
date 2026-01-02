import { LRUCache } from "lru-cache";

const cache = new LRUCache({
  max: 500,
  ttl: 1000 * 60 * 60 * 24, // 24 hours
});

export default cache;
