const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/searchController");

router.get("/suggestions", ctrl.getSearchSuggestions);

module.exports = router;
