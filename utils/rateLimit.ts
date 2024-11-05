export interface RateLimitConfig {
    interval: number;
    uniqueTokenPerInterval: number;
  }
  
  interface TokenBucket {
    tokens: number;
    lastRefill: number;
  }
  
  export function rateLimit(config: RateLimitConfig) {
    const tokenBuckets = new Map<string, TokenBucket>();
  
    return {
      check: async (key: string, limit: number) => {
        const now = Date.now();
        let bucket = tokenBuckets.get(key);
  
        if (!bucket) {
          bucket = { tokens: limit, lastRefill: now };
          tokenBuckets.set(key, bucket);
        } else {
          // Refill tokens based on time passed
          const timePassed = now - bucket.lastRefill;
          const refillAmount = Math.floor(timePassed / config.interval) * limit;
          bucket.tokens = Math.min(limit, bucket.tokens + refillAmount);
          bucket.lastRefill = now;
        }
  
        if (bucket.tokens > 0) {
          bucket.tokens--;
          return true;
        }
  
        throw new Error('Rate limit exceeded');
      }
    };
  }