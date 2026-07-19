const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/publicationController");

router.get("/", ctrl.getAllPublications);
router.get("/professor/:professorId", ctrl.getPublicationsByProfessor);

module.exports = router;
