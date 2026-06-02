const express = require("express");
const router = express.Router();
const studentController = require("../controllers/students");
const { isAuthenticated } = require("../middleware/auth");

router.get("/", studentController.getAllStudents);              // ✅ Public GET
router.get("/:id", studentController.getStudent);               // ✅ Public GET

router.post("/", isAuthenticated, studentController.createStudent);       // 🔐 Protected
router.put("/:id", isAuthenticated, studentController.updateStudent);     // 🔐 Protected
router.delete("/:id", isAuthenticated, studentController.deleteStudent);  // 🔐 Protected

module.exports = router;
