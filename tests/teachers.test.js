const {
  getAllTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} = require("../controllers/teachers");

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
   GET ALL TEACHERS
============================================================ */
describe("GET ALL TEACHERS", () => {
  it("should return all teachers", async () => {
    const req = mockReq();
    const res = mockRes();

    mockCollection.toArray.mockResolvedValue([{ firstName: "Alice" }]);

    await getAllTeachers(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ firstName: "Alice" }]);
  });

  it("should handle server errors", async () => {
    const req = mockReq();
    const res = mockRes();

    mockCollection.toArray.mockRejectedValue(new Error("DB error"));

    await getAllTeachers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Server error" });
  });
});

/* ============================================================
   GET TEACHER
============================================================ */
describe("GET TEACHER", () => {
  it("should return a teacher", async () => {
    const req = mockReq();
    req.params.id = new ObjectId().toString();
    const res = mockRes();

    mockCollection.findOne.mockResolvedValue({ firstName: "Alice" });

    await getTeacher(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ firstName: "Alice" });
  });

  it("should return 404 if teacher not found", async () => {
    const req = mockReq();
    req.params.id = new ObjectId().toString();
    const res = mockRes();

    mockCollection.findOne.mockResolvedValue(null);

    await getTeacher(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Teacher not found" });
  });

  it("should return 400 for invalid ObjectId", async () => {
    const req = mockReq();
    req.params.id = "invalid-id";
    const res = mockRes();

    await getTeacher(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid teacher ID format",
    });
  });
});

/* ============================================================
   CREATE TEACHER
============================================================ */
describe("CREATE TEACHER", () => {
  it("should create a teacher successfully", async () => {
    const req = mockReq();
    req.body = {
      firstName: "Alice",
      lastName: "Brown",
      email: "alice@school.com",
      department: "Mathematics",
      office: "B2",
      hireDate: "2022-08-01",
    };

    const res = mockRes();
    mockCollection.insertOne.mockResolvedValue({ insertedId: "5678" });

    await createTeacher(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Teacher created successfully",
      teacherId: "5678",
    });
  });

  it("should return validation error", async () => {
    const req = mockReq();
    req.body = {
      lastName: "Brown",
      email: "fakeemail",
    };

    const res = mockRes();

    await createTeacher(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

/* ============================================================
   UPDATE TEACHER
============================================================ */
describe("UPDATE TEACHER", () => {
  it("should update a teacher successfully", async () => {
    const req = mockReq();
    req.params.id = new ObjectId().toString();
    req.body = {
      firstName: "Alice",
      lastName: "Brown",
      email: "alice@school.com",
      department: "Science",
      office: "B3",
      hireDate: "2023-08-01",
    };

    const res = mockRes();
    mockCollection.updateOne.mockResolvedValue({ matchedCount: 1 });

    await updateTeacher(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Teacher updated successfully",
    });
  });

  it("should return 404 if teacher not found", async () => {
    const req = mockReq();
    req.params.id = new ObjectId().toString();
    req.body = {
      firstName: "Alice",
      lastName: "Brown",
      email: "alice@school.com",
      department: "Science",
    };

    const res = mockRes();
    mockCollection.updateOne.mockResolvedValue({ matchedCount: 0 });

    await updateTeacher(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Teacher not found" });
  });
});

/* ============================================================
   DELETE TEACHER
============================================================ */
describe("DELETE TEACHER", () => {
  it("should delete a teacher", async () => {
    const req = mockReq();
    req.params.id = new ObjectId().toString();
    const res = mockRes();

    mockCollection.deleteOne.mockResolvedValue({ deletedCount: 1 });

    await deleteTeacher(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Teacher deleted successfully",
    });
  });

  it("should return 404 if teacher not found", async () => {
    const req = mockReq();
    req.params.id = new ObjectId().toString();
    const res = mockRes();

    mockCollection.deleteOne.mockResolvedValue({ deletedCount: 0 });

    await deleteTeacher(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Teacher not found",
    });
  });
});
