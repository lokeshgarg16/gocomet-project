const redis = require('../config/redis');

exports.acquireLock = async (ref_id, ttl = 5000) => {
    const lockKey = `lock:booking:${ref_id}`;
    const result = await redis.set(lockKey, 'locked', 'PX', ttl, 'NX');
    return result === 'OK';
};

exports.releaseLock = async (ref_id) => {
    const lockKey = `lock:booking:${ref_id}`;
    await redis.del(lockKey);
};