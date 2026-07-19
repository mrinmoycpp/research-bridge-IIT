const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/professorController");

router.get("/", ctrl.getProfessors);
router.get("/related/:slug", ctrl.getRelatedProfessors);
router.get("/:slug", ctrl.getProfessorBySlug);

module.exports = router;
