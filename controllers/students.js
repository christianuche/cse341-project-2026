const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

// ========================= GET ALL STUDENTS =========================
const getAllStudents = async (req, res) => {
  //#swagger.tags=["Students"]
  try {
    const db = mongodb.getDb();
    const students = await db.collection("students").find().toArray();
    res.status(200).json(students);
  } catch (err) {
    console.error("GET all students error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ========================= GET SINGLE STUDENT =========================
const getStudent = async (req, res) => {
  //#swagger.tags=["Students"]
  try {
    const studentId = new ObjectId(req.params.id);
    const db = mongodb.getDb();
    const student = await db.collection("students").findOne({ _id: studentId });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json(student);
  } catch (err) {
    console.error("GET student error:", err);
    res.status(400).json({ error: "Invalid student ID format" });
  }
};

// ========================= VALIDATION FUNCTION =========================
function validateStudent(data) {
  const requiredFields = ["firstName", "lastName", "age", "gender", "email"];
  const missing = requiredFields.filter((f) => !data[f]);

  if (missing.length > 0) {
    return `Missing required fields: ${missing.join(", ")}`;
  }

  if (typeof data.age !== "number" || data.age <= 0) {
    return "Age must be a valid positive number";
  }

  const allowedGenders = ["Male", "Female", "Other"];
  if (!allowedGenders.includes(data.gender)) {
    return "Gender must be 'Male', 'Female', or 'Other'";
  }

  const emailRegex = /^[\w.-]+@[\w.-]+\.\w{2,}$/;
  if (!emailRegex.test(data.email)) {
    return "Invalid email format";
  }

  return null;
}

// ========================= CREATE STUDENT =========================
const createStudent = async (req, res) => {
  //#swagger.tags=["Students"]
  try {
    const { firstName, lastName, age, gender, email, birthday } = req.body;
    // Validation
    const validationError = validateStudent(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const student = { firstName, lastName, age, gender, email, birthday };

    const db = mongodb.getDb();
    const response = await db.collection("students").insertOne(student);

    res.status(201).json({
      message: "Student created successfully",
      studentId: response.insertedId
    });
  } catch (err) {
    console.error("Create student error:", err);
    res.status(500).json({ error: "Server error while creating student" });
  }
};

// ========================= UPDATE STUDENT =========================
const updateStudent = async (req, res) => {
  //#swagger.tags=["Students"]
  try {
    const studentId = new ObjectId(req.params.id);
    const { firstName, lastName, age, gender, email, birthday } = req.body;

    // Validation
    const validationError = validateStudent(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const student = { firstName, lastName, age, gender, email, birthday };

    const db = mongodb.getDb();
    const response = await db.collection("students").updateOne(
      { _id: studentId },
      { $set: student }
    );

    if (response.matchedCount === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student updated successfully" });
  } catch (err) {
    console.error("Update student error:", err);
    res.status(500).json({ message: "Server error while updating student" });
  }
};

// ========================= DELETE STUDENT =========================
const deleteStudent = async (req, res) => {
  //#swagger.tags=["Students"]
  try {
    const studentId = new ObjectId(req.params.id);

    const db = mongodb.getDb();
    const response = await db.collection("students").deleteOne({ _id: studentId });

    if (response.deletedCount === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("Delete student error:", err);
    res.status(500).json({ message: "Server error while deleting student" });
  }
};

module.exports = {
  getAllStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent
};
