/**
 * @jest-environment node
 */

const {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");

const mongodb = require("../data/database");
const { ObjectId } = require("mongodb");

// Mock the db connection
jest.mock("../data/database", () => ({
  getDb: jest.fn(),
}));

describe("COURSES CONTROLLER", () => {
  let mockCollection;
  let mockDb;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockCollection = {
      find: jest.fn().mockReturnThis(),
      toArray: jest.fn(),
      findOne: jest.fn(),
      insertOne: jest.fn(),
      updateOne: jest.fn(),
      deleteOne: jest.fn(),
    };

    mockDb = {
      collection: jest.fn(() => mockCollection),
    };

    mongodb.getDb.mockReturnValue(mockDb);

    mockReq = {
      params: {},
      body: {},
    };

    mockRes = {
      status: jest.fn(() => mockRes),
      json: jest.fn(),
    };
  });

  // ============================================================
  // GET ALL COURSES
  // ============================================================
  test("getAllCourses → should return list of courses", async () => {
    const sampleCourses = [{ title: "Math 101" }];
    mockCollection.toArray.mockResolvedValue(sampleCourses);

    await getAllCourses(mockReq, mockRes);

    expect(mockCollection.find).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(sampleCourses);
  });

  // ============================================================
  // GET SINGLE COURSE
  // ============================================================
  test("getCourse → should return a single course", async () => {
    const id = "65abf1e75cc0f2b1be234567";
    mockReq.params.id = id;

    const sampleCourse = { _id: new ObjectId(id), title: "Chemistry" };
    mockCollection.findOne.mockResolvedValue(sampleCourse);

    await getCourse(mockReq, mockRes);

    expect(mockCollection.findOne).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(sampleCourse);
  });

  test("getCourse → should return 404 if not found", async () => {
    mockReq.params.id = "65abf1e75cc0f2b1be111222";

    mockCollection.findOne.mockResolvedValue(null);

    await getCourse(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Course not found" });
  });

  test("getCourse → invalid ID format should return 400", async () => {
    mockReq.params.id = "invalid-id";

    await getCourse(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  // ============================================================
  // CREATE COURSE
  // ============================================================
  test("createCourse → should create and return courseId", async () => {
    mockReq.body = {
      courseCode: "CSC101",
      title: "Intro to CS",
      department: "Computer Science",
      units: 3,
    };

    mockCollection.insertOne.mockResolvedValue({
      insertedId: "abc123",
    });

    await createCourse(mockReq, mockRes);

    expect(mockCollection.insertOne).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(201);
  });

  test("createCourse → missing fields should return 400", async () => {
    mockReq.body = {
      courseCode: "CSC101",
    };

    await createCourse(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalled();
  });

  // ============================================================
  // UPDATE COURSE
  // ============================================================
  test("updateCourse → should update course", async () => {
    mockReq.params.id = "65abf1e75cc0f2b1be999888";

    mockReq.body = {
      courseCode: "CSC102",
      title: "Advanced CS",
      department: "CS",
      units: 3,
    };

    mockCollection.updateOne.mockResolvedValue({
      matchedCount: 1,
    });

    await updateCourse(mockReq, mockRes);

    expect(mockCollection.updateOne).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  test("updateCourse → should return 404 if course not found", async () => {
    mockReq.params.id = "65abf1e75cc0f2b1be000000";

    mockReq.body = {
      courseCode: "CSC102",
      title: "AI",
      department: "CS",
    };

    mockCollection.updateOne.mockResolvedValue({
      matchedCount: 0,
    });

    await updateCourse(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
  });

  test("updateCourse → validation errors return 400", async () => {
    mockReq.params.id = "65abf1e75cc0f2b1be000111";
    mockReq.body = { title: "Missing required fields" };

    await updateCourse(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  // ============================================================
  // DELETE COURSE
  // ============================================================
  test("deleteCourse → should delete course", async () => {
    mockReq.params.id = "65abf1e75cc0f2b1be222333";

    mockCollection.deleteOne.mockResolvedValue({
      deletedCount: 1,
    });

    await deleteCourse(mockReq, mockRes);

    expect(mockCollection.deleteOne).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  test("deleteCourse → 404 when not found", async () => {
    mockReq.params.id = "65abf1e75cc0f2b1be222444";

    mockCollection.deleteOne.mockResolvedValue({
      deletedCount: 0,
    });

    await deleteCourse(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
  });
});
