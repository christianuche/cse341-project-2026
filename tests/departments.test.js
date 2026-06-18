const {
  getAllDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departments");

const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

// Mock DB
const mockCollection = {
  find: jest.fn().mockReturnThis(),
  toArray: jest.fn(),
  findOne: jest.fn(),
  insertOne: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn(),
};

const mockDb = {
  collection: jest.fn(() => mockCollection),
};

jest.mock("../data/database", () => ({
  getDb: jest.fn(),
}));

// Mock Express req/res
const mockReq = () => ({ params: {}, body: {} });
const mockRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

beforeEach(() => {
  jest.clearAllMocks();
  mongodb.getDb.mockReturnValue(mockDb);
});

/* ============================================================
   GET ALL DEPARTMENTS
============================================================ */
describe("GET ALL DEPARTMENTS", () => {
  it("should return all departments", async () => {
    const req = mockReq();
    const res = mockRes();

    mockCollection.toArray.mockResolvedValue([{ departmentName: "Science" }]);

    await getAllDepartments(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ departmentName: "Science" }]);
  });

  it("should handle server error", async () => {
    const req = mockReq();
    const res = mockRes();

    mockCollection.toArray.mockRejectedValue(new Error("DB error"));

    await getAllDepartments(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Server error" });
  });
});

/* ============================================================
   GET DEPARTMENT
============================================================ */
describe("GET DEPARTMENT", () => {
  it("should return department details", async () => {
    const req = mockReq();
    req.params.id = new ObjectId().toString();
    const res = mockRes();

    mockCollection.findOne.mockResolvedValue({
      departmentName: "Engineering",
    });

    await getDepartment(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      departmentName: "Engineering",
    });
  });

  it("should return 404 if department is not found", async () => {
    const req = mockReq();
    req.params.id = new ObjectId().toString();
    const res = mockRes();

    mockCollection.findOne.mockResolvedValue(null);

    await getDepartment(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Department not found",
    });
  });

  it("should return 400 for invalid objectId", async () => {
    const req = mockReq();
    req.params.id = "invalid-id";
    const res = mockRes();

    await getDepartment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid department ID format",
    });
  });
});

/* ============================================================
   CREATE DEPARTMENT
============================================================ */
describe("CREATE DEPARTMENT", () => {
  it("should create a department successfully", async () => {
    const req = mockReq();
    req.body = {
      departmentName: "Engineering",
      departmentCode: "ENG",
      faculty: "Science & Tech",
      headOfDepartment: "Dr John",
      officeLocation: "Block B",
      phone: "123456789",
      email: "dept@example.com",
      description: "Engineering department",
    };

    const res = mockRes();
    mockCollection.insertOne.mockResolvedValue({ insertedId: "12345" });

    await createDepartment(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Department created successfully",
      departmentId: "12345",
    });
  });

  it("should return validation error if fields missing", async () => {
    const req = mockReq();
    req.body = {
      departmentCode: "ENG",
    };
    const res = mockRes();

    await createDepartment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should fail for short department name", async () => {
    const req = mockReq();
    req.body = {
      departmentName: "AB",
      departmentCode: "ENG",
    };
    const res = mockRes();

    await createDepartment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should fail for short department code", async () => {
    const req = mockReq();
    req.body = {
      departmentName: "Engineering",
      departmentCode: "E",
    };
    const res = mockRes();

    await createDepartment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

/* ============================================================
   UPDATE DEPARTMENT
============================================================ */
describe("UPDATE DEPARTMENT", () => {
  it("should update a department successfully", async () => {
    const req = mockReq();
    req.params.id = new ObjectId().toString();
    req.body = {
      departmentName: "Engineering",
      departmentCode: "ENG",
      faculty: "Science",
      headOfDepartment: "Dr Maxwell",
      officeLocation: "Block C",
      phone: "987654321",
      email: "new@example.com",
      description: "Updated description",
    };

    const res = mockRes();

    mockCollection.updateOne.mockResolvedValue({ matchedCount: 1 });

    await updateDepartment(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Department updated successfully",
    });
  });

  it("should return 404 if department not found", async () => {
    const req = mockReq();
    req.params.id = new ObjectId().toString();
    req.body = {
      departmentName: "Engineering",
      departmentCode: "ENG",
    };

    const res = mockRes();
    mockCollection.updateOne.mockResolvedValue({ matchedCount: 0 });

    await updateDepartment(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Department not found",
    });
  });

  it("should return validation error", async () => {
    const req = mockReq();
    req.params.id = new ObjectId().toString();
    req.body = {
      departmentCode: "AB",
    };

    const res = mockRes();

    await updateDepartment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

/* ============================================================
   DELETE DEPARTMENT
============================================================ */
describe("DELETE DEPARTMENT", () => {
  it("should delete a department", async () => {
    const req = mockReq();
    req.params.id = new ObjectId().toString();
    const res = mockRes();

    mockCollection.deleteOne.mockResolvedValue({ deletedCount: 1 });

    await deleteDepartment(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Department deleted successfully",
    });
  });

  it("should return 404 if department not found", async () => {
    const req = mockReq();
    req.params.id = new ObjectId().toString();
    const res = mockRes();

    mockCollection.deleteOne.mockResolvedValue({ deletedCount: 0 });

    await deleteDepartment(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Department not found",
    });
  });
});
