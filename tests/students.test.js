const {
  getAllStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/students");

const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

// Mock DB instance
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

/* ===================================================================
   GET ALL STUDENTS
=================================================================== */
describe("GET ALL STUDENTS", () => {
  it("should return all students", async () => {
    const req = mockReq();
    const res = mockRes();

    mockCollection.toArray.mockResolvedValue([{ firstName: "John" }]);

    await getAllStudents(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ firstName: "John" }]);
  });

  it("should handle server errors", async () => {
    const req = mockReq();
    const res = mockRes();

    mockCollection.toArray.mockRejectedValue(new Error("DB error"));

    await getAllStudents(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Server error" });
  });
});

/* ===================================================================
   GET ONE STUDENT
=================================================================== */
describe("GET STUDENT", () => {
  it("should return a student", async () => {
    const req = mockReq();
    req.params.id = new ObjectId().toString();

    const res = mockRes();

    mockCollection.findOne.mockResolvedValue({ firstName: "John" });

    await getStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ firstName: "John" });
  });

  it("should return 404 if student not found", async () => {
    const req = mockReq();
    req.params.id = new ObjectId().toString();

    const res = mockRes();

    mockCollection.findOne.mockResolvedValue(null);

    await getStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Student not found" });
  });

  it("should return 400 for invalid ObjectId", async () => {
    const req = mockReq();
    req.params.id = "invalid-id";
    const res = mockRes();

    await getStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid student ID format",
    });
  });
});

/* ===================================================================
   CREATE STUDENT
=================================================================== */
describe("CREATE STUDENT", () => {
  it("should create a student successfully", async () => {
    const req = mockReq();
    req.body = {
      firstName: "John",
      lastName: "Doe",
      age: 21,
      gender: "Male",
      email: "john@example.com",
    };

    const res = mockRes();

    mockCollection.insertOne.mockResolvedValue({ insertedId: "1234" });

    await createStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Student created successfully",
      studentId: "1234",
    });
  });

  it("should return validation error", async () => {
    const req = mockReq();
    req.body = {
      lastName: "Doe",
    };

    const res = mockRes();

    await createStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

/* ===================================================================
   UPDATE STUDENT
=================================================================== */
describe("UPDATE STUDENT", () => {
  it("should update a student successfully", async () => {
    const req = mockReq();
    req.params.id = new ObjectId().toString();
    req.body = {
      firstName: "John",
      lastName: "Doe",
      age: 22,
      gender: "Male",
      email: "john@example.com",
    };

    const res = mockRes();

    mockCollection.updateOne.mockResolvedValue({ matchedCount: 1 });

    await updateStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 404 if student not found", async () => {
    const req = mockReq();
    req.params.id = new ObjectId().toString();
    req.body = {
      firstName: "John",
      lastName: "Doe",
      age: 22,
      gender: "Male",
      email: "john@example.com",
    };

    const res = mockRes();

    mockCollection.updateOne.mockResolvedValue({ matchedCount: 0 });

    await updateStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

/* ===================================================================
   DELETE STUDENT
=================================================================== */
describe("DELETE STUDENT", () => {
  it("should delete a student successfully", async () => {
    const req = mockReq();
    req.params.id = new ObjectId().toString();

    const res = mockRes();

    mockCollection.deleteOne.mockResolvedValue({ deletedCount: 1 });

    await deleteStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 404 if student not found", async () => {
    const req = mockReq();
    req.params.id = new ObjectId().toString();

    const res = mockRes();

    mockCollection.deleteOne.mockResolvedValue({ deletedCount: 0 });

    await deleteStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});
