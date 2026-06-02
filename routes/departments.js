const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/departments");
const { isAuthenticated } = require("../middleware/auth");

router.get("/", departmentController.getAllDepartments);             // ✅ Public GET
router.get("/:id", departmentController.getDepartment);              // ✅ Public GET

router.post("/", isAuthenticated, departmentController.createDepartment);      // 🔐 Protected
router.put("/:id", isAuthenticated, departmentController.updateDepartment);    // 🔐 Protected
router.delete("/:id", isAuthenticated, departmentController.deleteDepartment); // 🔐 Protected

module.exports = router;