const express = require("express");
const router = express.Router();

const professorRoutes = require("./professorRoutes");
const iitRoutes = require("./iitRoutes");
const researchAreaRoutes = require("./researchAreaRoutes");
const publicationRoutes = require("./publicationRoutes");
const opportunityRoutes = require("./opportunityRoutes");
const searchRoutes = require("./searchRoutes");
const statsRoutes = require("./statsRoutes");
const authRoutes = require("./authRoutes");
const applicationRoutes = require("./applicationRoutes");

router.use("/professors", professorRoutes);
router.use("/iits", iitRoutes);
router.use("/research-areas", researchAreaRoutes);
router.use("/publications", publicationRoutes);
router.use("/opportunities", opportunityRoutes);
router.use("/search", searchRoutes);
router.use("/stats", statsRoutes);
router.use("/auth", authRoutes);
router.use("/applications", applicationRoutes);

module.exports = router;
