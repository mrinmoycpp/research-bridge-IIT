const statsService = require("../services/statsService");

async function getPlatformStats(req, res, next) {
  try {
    const stats = await statsService.getPlatformStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getPlatformStats,
};
