const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const ctrl = require("../controllers/applicationController");

router.get("/", auth, ctrl.getApplications);
router.post("/", auth, ctrl.addApplication);
router.put("/:id", auth, ctrl.updateApplication);
router.delete("/:professorId", auth, ctrl.removeApplication);

module.exports = router;
