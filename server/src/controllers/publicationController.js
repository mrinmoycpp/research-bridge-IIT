const publicationService = require("../services/publicationService");

async function getAllPublications(req, res, next) {
  try {
    const pubs = await publicationService.getAllPublications();
    res.json(pubs);
  } catch (err) {
    next(err);
  }
}

async function getPublicationsByProfessor(req, res, next) {
  try {
    const pubs = await publicationService.getPublicationsByProfessor(req.params.professorId);
    res.json(pubs);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllPublications,
  getPublicationsByProfessor,
};
