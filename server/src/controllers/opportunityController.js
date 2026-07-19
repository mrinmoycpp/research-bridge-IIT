const opportunityService = require("../services/opportunityService");

async function getAllOpportunities(req, res, next) {
  try {
    const opps = await opportunityService.getAllOpportunities();
    res.json(opps);
  } catch (err) {
    next(err);
  }
}

async function getOpportunitiesByProfessor(req, res, next) {
  try {
    const opps = await opportunityService.getOpportunitiesByProfessor(req.params.professorId);
    res.json(opps);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllOpportunities,
  getOpportunitiesByProfessor,
};
