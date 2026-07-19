const appService = require("../services/applicationService");

async function getApplications(req, res, next) {
  try {
    const apps = await appService.getApplications(req.userId);
    res.json(apps);
  } catch (err) {
    next(err);
  }
}

async function addApplication(req, res, next) {
  try {
    const { professorId, status, notes } = req.body;
    if (!professorId) {
      return res.status(400).json({ error: "professorId is required" });
    }
    const app = await appService.addApplication(req.userId, professorId, status, notes);
    res.status(201).json(app);
  } catch (err) {
    next(err);
  }
}

async function updateApplication(req, res, next) {
  try {
    const { status, notes } = req.body;
    const app = await appService.updateApplication(req.userId, parseInt(req.params.id), status, notes);
    res.json(app);
  } catch (err) {
    next(err);
  }
}

async function removeApplication(req, res, next) {
  try {
    await appService.removeApplication(req.userId, req.params.professorId);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { getApplications, addApplication, updateApplication, removeApplication };
