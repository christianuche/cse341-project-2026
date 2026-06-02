const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courses");
const {isAuthenticated} = require("../middleware/auth");

router.get("/", courseController.getAllCourses);           // ✅ Public GET
router.get("/:id", courseController.getCourse);            // ✅ Public GET

router.post("/", isAuthenticated, courseController.createCourse);       // 🔐 Protected
router.put("/:id", isAuthenticated, courseController.updateCourse);     // 🔐 Protected
router.delete("/:id", isAuthenticated, courseController.deleteCourse);  // 🔐 Protected

module.exports = router;
