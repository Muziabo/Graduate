import { createClient } from "redis";

const redis = createClient({
    url: process.env.REDIS_URL, // Use an environment variable for the Redis URL
});

redis.on("error", (err) => console.error("Redis Client Error", err));

// Ensure connection
(async () => {
    if (!redis.isOpen) await redis.connect();
})();

export default redis;