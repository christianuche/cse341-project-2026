const express = require("express");
const router = express.Router();
const templeController = require("../controllers/temples");

router.get("/", templeController.getAllTemples);
router.get("/:id", templeController.getSingleTemple);
router.post("/", templeController.createTemple);
router.put("/:id", templeController.updateTemple);
router.delete("/:id", templeController.deleteTemple);

module.exports = router;