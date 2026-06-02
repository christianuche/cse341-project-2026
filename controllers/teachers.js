const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

// ========================= GET ALL TEACHERS =========================
const getAllTeachers = async (req, res) => {
  //#swagger.tags=["Teachers"]
  try {
    const db = mongodb.getDb();
    const teachers = await db.collection("teachers").find().toArray();
    res.status(200).json(teachers);
  } catch (err) {
    console.error("GET all teachers error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ========================= GET SINGLE TEACHER =========================
const getTeacher = async (req, res) => {
  //#swagger.tags=["Teachers"]
  try {
    const teacherId = new ObjectId(req.params.id);
    const db = mongodb.getDb();
    const teacher = await db.collection("teachers").findOne({ _id: teacherId });

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    res.status(200).json(teacher);
  } catch (err) {
    console.error("GET teacher error:", err);
    res.status(400).json({ error: "Invalid teacher ID format" });
  }
};

// ========================= VALIDATION FUNCTION =========================
function validateTeacher(data) {
  const requiredFields = ["firstName", "lastName", "email", "department"];
  const missing = requiredFields.filter((f) => !data[f]);

  if (missing.length > 0) {
    return `Missing required fields: ${missing.join(", ")}`;
  }

  const emailRegex = /^[\w.-]+@[\w.-]+\.\w{2,}$/;
  if (!emailRegex.test(data.email)) {
    return "Invalid email format, please provide a valid email address";
  }

  return null;
}

// ========================= CREATE TEACHER =========================
const createTeacher = async (req, res) => {
  //#swagger.tags=["Teachers"]
  try {
    const { firstName, lastName, email, department, office, hireDate } = req.body;

    // Validation
    const validationError = validateTeacher(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const teacher = {
      firstName,
      lastName,
      email,
      department,
      office,
      hireDate
    };

    const db = mongodb.getDb();
    const response = await db.collection("teachers").insertOne(teacher);

    res.status(201).json({
      message: "Teacher created successfully",
      teacherId: response.insertedId
    });
  } catch (err) {
    console.error("Create teacher error:", err);
    res.status(500).json({ error: "Server error while creating teacher" });
  }
};

// ========================= UPDATE TEACHER =========================
const updateTeacher = async (req, res) => {
  //#swagger.tags=["Teachers"]
  try {
    const teacherId = new ObjectId(req.params.id);
    const { firstName, lastName, email, department, office, hireDate } = req.body;

    // Validation
    const validationError = validateTeacher(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const teacher = {
      firstName,
      lastName,
      email,
      department,
      office,
      hireDate
    };

    const db = mongodb.getDb();
    const response = await db.collection("teachers").updateOne(
      { _id: teacherId },
      { $set: teacher }
    );

    if (response.matchedCount === 0) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json({ message: "Teacher updated successfully" });
  } catch (err) {
    console.error("Update teacher error:", err);
    res.status(500).json({ message: "Server error while updating teacher" });
  }
};

// ========================= DELETE TEACHER =========================
const deleteTeacher = async (req, res) => {
  //#swagger.tags=["Teachers"]
  try {
    const teacherId = new ObjectId(req.params.id);

    const db = mongodb.getDb();
    const response = await db.collection("teachers").deleteOne({ _id: teacherId });

    if (response.deletedCount === 0) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (err) {
    console.error("Delete teacher error:", err);
    res.status(500).json({ message: "Server error while deleting teacher" });
  }
};

module.exports = {
  getAllTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher
};
