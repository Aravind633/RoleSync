import { redisClient } from '../../config/redis.js';

export const getTopRecommendations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    // Look up the AI matches cached by the BullMQ worker
    const cachedMatches = await redisClient.get(`top_matches:candidate:${userId}`);

    if (cachedMatches) {
      return res.status(200).json({
        status: 'success',
        source: 'redis-cache',
        data: JSON.parse(cachedMatches)
      });
    }

    // If no cache exists yet (worker hasn't run or expired), return empty for now
    res.status(200).json({
      status: 'success',
      source: 'database',
      data: []
    });
  } catch (error) {
    next(error);
  }
};