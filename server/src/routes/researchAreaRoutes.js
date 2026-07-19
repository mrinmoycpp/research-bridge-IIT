const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/researchAreaController");

router.get("/", ctrl.getResearchAreas);
router.get("/:slug", ctrl.getResearchAreaBySlug);

module.exports = router;
