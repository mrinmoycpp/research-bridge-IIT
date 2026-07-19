const researchAreaService = require("../services/researchAreaService");

async function getResearchAreas(req, res, next) {
  try {
    const areas = await researchAreaService.getAllResearchAreas();
    res.json(areas);
  } catch (err) {
    next(err);
  }
}

async function getResearchAreaBySlug(req, res, next) {
  try {
    const area = await researchAreaService.getResearchAreaBySlug(req.params.slug);
    if (!area) return res.status(404).json({ error: "Research area not found" });
    res.json(area);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getResearchAreas,
  getResearchAreaBySlug,
};
