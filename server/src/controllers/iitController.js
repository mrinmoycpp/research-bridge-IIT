const iitService = require("../services/iitService");

async function getIITs(req, res, next) {
  try {
    const iits = await iitService.getAllIITs();
    res.json(iits);
  } catch (err) {
    next(err);
  }
}

async function getIITById(req, res, next) {
  try {
    const iit = await iitService.getIITById(req.params.id);
    if (!iit) return res.status(404).json({ error: "IIT not found" });
    res.json(iit);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getIITs,
  getIITById,
};
