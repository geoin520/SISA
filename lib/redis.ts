/**
 * Shared Upstash Redis client.
 *
 * Uses HTTP/REST (connectionless), ideal for serverless functions.
 *
 * Supports two sets of env vars (both auto-injected by Vercel when you
 * create an Upstash Redis database via the Vercel Storage Marketplace):
 *   - KV_REST_API_URL / KV_REST_API_TOKEN        (Vercel KV compatibility)
 *   - UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN  (Upstash native)
 *
 * @see https://upstash.com/docs/redis/howto/connectwithupstashredis
 */

import { Redis } from "@upstash/redis";

let _client: Redis | null = null;

/**
 * Returns a singleton Upstash Redis client.
 * Returns null if no env vars are configured (e.g. local dev without Redis).
 */
export function getRedis(): Redis | null {
  if (_client) return _client;

  // Vercel injects KV_REST_API_* when creating Upstash Redis via Marketplace.
  // Fall back to UPSTASH_REDIS_REST_* for direct Upstash integrations.
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  _client = new Redis({ url, token });
  return _client;
}

/** Redis key for the subscriber email set. */
export const SUBSCRIBERS_KEY = "sisa:subscribers";

/**
 * Get all subscriber emails.
 * Prefers Upstash Redis; falls back to EMAIL_SUBSCRIBERS env var.
 */
export async function getSubscribers(): Promise<string[]> {
  const redis = getRedis();
  if (redis) {
    try {
      return await redis.smembers(SUBSCRIBERS_KEY);
    } catch (err) {
      console.error("[redis] smembers failed:", err);
    }
  }
  // Fallback: env var
  return (process.env.EMAIL_SUBSCRIBERS ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
}

/**
 * Add a subscriber email. Returns true if newly added, false if already existed.
 * If Redis is unavailable, returns true (optimistic) and logs a warning.
 */
export async function addSubscriber(email: string): Promise<boolean> {
  const redis = getRedis();
  if (!redis) {
    console.warn(
      `[redis] Redis not configured — email "${email}" not persisted. ` +
        "Ensure KV_REST_API_URL / KV_REST_API_TOKEN are set, or use EMAIL_SUBSCRIBERS as fallback."
    );
    return true;
  }
  try {
    const added = await redis.sadd(SUBSCRIBERS_KEY, email);
    return added === 1;
  } catch (err) {
    console.error("[redis] sadd failed:", err);
    return true;
  }
}
