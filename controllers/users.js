const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

// Get all users
const getAll = async (req, res) => {
    //#swagger.tags=["Users"]
    try {
        const db = mongodb.getDb();
        const result = await db.collection("users").find();
        const users = await result.toArray();
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single user by ID
const getSingle = async (req, res) => {
    //#swagger.tags=["Users"]
    try {
        const userId = new ObjectId(req.params.id);
        const db = mongodb.getDb();
        const result = await db.collection("users").find({ _id: userId });
        const users = await result.toArray();
        res.setHeader("Content-Type", "application/json");
        res.status(200).send(JSON.stringify(users, null, 2));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new user
const createUser = async (req, res) => {
    //#swagger.tags=["Users"]
    try {
        const user = {
            email: req.body.email,
            userName: req.body.userName,
            name: req.body.name,
            ipAddress: req.body.ipAddress,
        };

        const db = mongodb.getDb(); // ✅ no .db()
        const response = await db.collection("users").insertOne(user);

        if (response.acknowledged) {
            res.status(201).json({ message: "User created successfully", id: response.insertedId });
        } else {
            res.status(500).json({ message: "Failed to create user" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update an existing user
const updateUser = async (req, res) => {
    //#swagger.tags=["Users"]
    try {
        const userId = new ObjectId(req.params.id);
        const user = {
            email: req.body.email,
            userName: req.body.userName,
            name: req.body.name,
            ipAddress: req.body.ipAddress,
        };

        const db = mongodb.getDb();
        const response = await db.collection("users").replaceOne({ _id: userId }, user);

        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json({ message: "No user updated or user not found." });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    //#swagger.tags=["Users"]
    try {
        const userId = new ObjectId(req.params.id);
        const db = mongodb.getDb();
        const response = await db.collection("users").deleteOne({ _id: userId });

        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "User not found." });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAll,
    getSingle,
    createUser,
    updateUser,
    deleteUser,
};