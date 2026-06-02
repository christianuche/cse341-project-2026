const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

// ========================= GET ALL COURSES =========================
const getAllCourses = async (req, res) => {
  //#swagger.tags=["Courses"]
  try {
    const db = mongodb.getDb();
    const courses = await db.collection("courses").find().toArray();

    res.status(200).json(courses);
  } catch (err) {
    console.error("GET all courses error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ========================= GET SINGLE COURSE =========================
const getCourse = async (req, res) => {
  //#swagger.tags=["Courses"]
  try {
    const courseId = new ObjectId(req.params.id);
    const db = mongodb.getDb();

    const course = await db.collection("courses").findOne({ _id: courseId });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(200).json(course);
  } catch (err) {
    res.status(400).json({ error: "Invalid course ID format" });
  }
};

// ========================= VALIDATION FUNCTION =========================
function validateCourse(data) {
  const requiredFields = ["courseCode", "title", "department"];
  const missing = requiredFields.filter((field) => !data[field]);

  if (missing.length > 0) {
    return `Missing required fields: ${missing.join(", ")}`;
  }

  return null;
}

// ========================= CREATE COURSE =========================
const createCourse = async (req, res) => {
  //#swagger.tags=["Courses"]
  try {
    const { courseCode, title, units, department, semester, description } = req.body;

    // Validation
    const validationError = validateCourse(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const course = { courseCode, title, units, department, semester, description };

    const db = mongodb.getDb();
    const response = await db.collection("courses").insertOne(course);

    res.status(201).json({
      message: "Course created successfully",
      courseId: response.insertedId
    });
  } catch (err) {
    console.error("Create course error:", err);
    res.status(500).json({ error: "Server error while creating course" });
  }
};

// ========================= UPDATE COURSE =========================
const updateCourse = async (req, res) => {
  //#swagger.tags=["Courses"]
  try {
    const courseId = new ObjectId(req.params.id);
    const { courseCode, title, units, department, semester, description } = req.body;

    // Validation
    const validationError = validateCourse(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const course = { courseCode, title, units, department, semester, description };

    const db = mongodb.getDb();
    const response = await db.collection("courses").updateOne(
      { _id: courseId },
      { $set: course }
    );

    if (response.matchedCount === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course updated successfully" });
  } catch (err) {
    console.error("Update course error:", err);
    res.status(500).json({ message: "Server error while updating course" });
  }
};

// ========================= DELETE COURSE =========================
const deleteCourse = async (req, res) => {
  //#swagger.tags=["Courses"]
  try {
    const courseId = new ObjectId(req.params.id);

    const db = mongodb.getDb();
    const response = await db.collection("courses").deleteOne({ _id: courseId });

    if (response.deletedCount === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("Delete course error:", err);
    res.status(500).json({ message: "Server error while deleting course" });
  }
};

module.exports = {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
