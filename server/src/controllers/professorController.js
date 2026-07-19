const professorService = require("../services/professorService");

async function getProfessors(req, res, next) {
  try {
    const { q, iit, department, researchArea, location, availability, position, sort } = req.query;
    const filters = {};
    if (q) filters.query = q;
    if (iit) filters.iit = iit;
    if (department) filters.department = department;
    if (researchArea) filters.researchArea = researchArea;
    if (location) filters.location = location;
    if (availability) filters.availability = availability;
    if (position) filters.position = position;

    const professors = await professorService.getAllProfessors(filters, sort || "relevance");
    res.json(professors);
  } catch (err) {
    next(err);
  }
}

async function getProfessorBySlug(req, res, next) {
  try {
    const professor = await professorService.getProfessorBySlug(req.params.slug);
    if (!professor) return res.status(404).json({ error: "Professor not found" });
    res.json(professor);
  } catch (err) {
    next(err);
  }
}

async function getRelatedProfessors(req, res, next) {
  try {
    const limit = parseInt(req.query.limit) || 4;
    const related = await professorService.getRelatedProfessors(req.params.slug, limit);
    res.json(related);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProfessors,
  getProfessorBySlug,
  getRelatedProfessors,
};
