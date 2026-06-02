const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teachers");
const { isAuthenticated } = require("../middleware/auth");

// ========================= PUBLIC GET ROUTES =========================
router.get("/", teacherController.getAllTeachers);      // ✅ Public GET (all)
router.get("/:id", teacherController.getTeacher);       // ✅ Public GET (single)

// ========================= PROTECTED ROUTES =========================
router.post("/", isAuthenticated, teacherController.createTeacher); // 🔐 Protected POST
router.put("/:id", isAuthenticated, teacherController.updateTeacher); // 🔐 Protected PUT
router.delete("/:id", isAuthenticated, teacherController.deleteTeacher); // 🔐 Protected DELETE

module.exports = router;