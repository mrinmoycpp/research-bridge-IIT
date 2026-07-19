const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/opportunityController");

router.get("/", ctrl.getAllOpportunities);
router.get("/professor/:professorId", ctrl.getOpportunitiesByProfessor);

module.exports = router;
