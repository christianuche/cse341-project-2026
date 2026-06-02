const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

// ========================= GET ALL DEPARTMENTS =========================
const getAllDepartments = async (req, res) => {
  //#swagger.tags=["Departments"]
  try {
    const db = mongodb.getDb();
    const departments = await db.collection("departments").find().toArray();
    res.status(200).json(departments);
  } catch (err) {
    console.error("GET all departments error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ========================= GET SINGLE DEPARTMENT =========================
const getDepartment = async (req, res) => {
  //#swagger.tags=["Departments"]
  try {
    const departmentId = new ObjectId(req.params.id);
    const db = mongodb.getDb();
    const department = await db
      .collection("departments")
      .findOne({ _id: departmentId });

    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    res.status(200).json(department);
  } catch (err) {
    console.error("GET department error:", err);
    res.status(400).json({ error: "Invalid department ID format" });
  }
};

// ========================= VALIDATION FUNCTION =========================
function validateDepartment(data) {
  const requiredFields = ["departmentName", "departmentCode"];
  const missing = requiredFields.filter((f) => !data[f]);

  if (missing.length > 0) {
    return `Missing required fields: ${missing.join(", ")}`;
  }

  if (typeof data.departmentName !== "string" || data.departmentName.length < 3) {
    return "Department name must be at least 3 characters";
  }

  if (typeof data.departmentCode !== "string" || data.departmentCode.length < 2) {
    return "Department code must be at least 2 characters";
  }

  return null;
}

// ========================= CREATE DEPARTMENT =========================
const createDepartment = async (req, res) => {
  //#swagger.tags=["Departments"]
  try {
    const { departmentName, 
        departmentCode, 
        faculty, 
        headOfDepartment, 
        officeLocation, 
        phone, 
        email, 
        description } = req.body;

    // Validation
    const validationError = validateDepartment(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const department = {
        departmentName, 
        departmentCode, 
        faculty, 
        headOfDepartment, 
        officeLocation, 
        phone, 
        email, 
        description
    };

    const db = mongodb.getDb();
    const response = await db.collection("departments").insertOne(department);

    res.status(201).json({
      message: "Department created successfully",
      departmentId: response.insertedId
    });
  } catch (err) {
    console.error("Create department error:", err);
    res.status(500).json({ error: "Server error while creating department" });
  }
};

// ========================= UPDATE DEPARTMENT =========================
const updateDepartment = async (req, res) => {
  //#swagger.tags=["Departments"]
  try {
    const departmentId = new ObjectId(req.params.id);
    const { departmentName, 
        departmentCode, 
        faculty, 
        headOfDepartment, 
        officeLocation, 
        phone, 
        email, 
        description } = req.body;

    // Validation
    const validationError = validateDepartment(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const department = {
        departmentName, 
        departmentCode, 
        faculty, 
        headOfDepartment, 
        officeLocation, 
        phone, 
        email, 
        description
    };

    const db = mongodb.getDb();
    const response = await db.collection("departments").updateOne(
      { _id: departmentId },
      { $set: department }
    );

    if (response.matchedCount === 0) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({ message: "Department updated successfully" });
  } catch (err) {
    console.error("Update department error:", err);
    res.status(500).json({ message: "Server error while updating department" });
  }
};

// ========================= DELETE DEPARTMENT =========================
const deleteDepartment = async (req, res) => {
  //#swagger.tags=["Departments"]
  try {
    const departmentId = new ObjectId(req.params.id);

    const db = mongodb.getDb();
    const response = await db
      .collection("departments")
      .deleteOne({ _id: departmentId });

    if (response.deletedCount === 0) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({ message: "Department deleted successfully" });
  } catch (err) {
    console.error("Delete department error:", err);
    res.status(500).json({ message: "Server error while deleting department" });
  }
};

module.exports = {
  getAllDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment
};
