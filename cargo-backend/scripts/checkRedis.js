const redis = require("../config/redis");

(async () => {
  try {
    console.log("Pinging Redis...");
    const pong = await redis.ping();
    console.log("PING response:", pong);

    console.log("Setting test key...");
    await redis.set("healthcheck:test", "ok", "EX", 10);
    const val = await redis.get("healthcheck:test");
    console.log("GET test key:", val);

    await redis.del("healthcheck:test");

    if (pong === "PONG" && val === "ok") {
      console.log("Redis health-check: SUCCESS");
      process.exit(0);
    } else {
      console.error("Redis health-check: FAILED (unexpected responses)");
      process.exit(2);
    }
  } catch (err) {
    console.error("Redis health-check: ERROR", err);
    process.exit(1);
  }
})();
