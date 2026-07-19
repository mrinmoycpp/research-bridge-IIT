const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/iitController");

router.get("/", ctrl.getIITs);
router.get("/:id", ctrl.getIITById);

module.exports = router;
