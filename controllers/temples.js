const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

// GET all temples
const getAllTemples = async (req, res) => {
    //#swagger.tags = ['Temples']
    try {
        const db = mongodb.getDb();
        const result = await db.collection("temples").find().toArray();
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET one contact
const getSingleTemple = async (req, res) => {
    //#swagger.tags = ['Temples']
    try {
        const contactId = new ObjectId(req.params.id);
        const db = mongodb.getDb();
        const result = await db.collection("temples").findOne({ _id: contactId });
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new temple
const createTemple = async (req, res) => {
    // Implementation for creating a temple
    //#swagger.tags = ['Temples']
    try {
        const temple = {
            templeName: req.body.name,
            location: req.body.location,
            dedicated: req.body.dedicated,
            area: req.body.area,
            imageUrl: req.body.imageUrl
        };
        const db = mongodb.getDb(); // ✅ no .db()
        const response = await db.collection("temples").insertOne(temple);
        if (response.acknowledged) {
            res.status(201).json({ message: "Temple created successfully", id: response.insertedId });
        } else {
            res.status(500).json({ message: "Failed to create temple" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update an existing temple
const updateTemple = async (req, res) => {
    // Implementation for updating a temple
    //#swagger.tags = ['Temples']
    try {
        const templeId = new ObjectId(req.params.id);
        const temple = {
            templeName: req.body.name,
            location: req.body.location,
            dedicated: req.body.dedicated,
            area: req.body.area,
            imageUrl: req.body.imageUrl
        };
        const db = mongodb.getDb();
        const response = await db.collection("temples").updateOne({ _id: templeId }, temple);

        if (response.modifiedCount > 0) {
            res.status(200).json({ message: "Temple updated successfully" });
        } else {
            res.status(500).json({ message: "No temple updated or temple not found." });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// Delete a temple
const deleteTemple = async (req, res) => {
    // Implementation for deleting a temple 
    //#swagger.tags = ['Temples']
    try {
        const templeId = new ObjectId(req.params.id);
        const db = mongodb.getDb();
        const response = await db.collection("temples").deleteOne({ _id: templeId });

        if (response.deletedCount > 0) {
            res.status(200).json({ message: "Temple deleted successfully" });
        } else {
            res.status(404).json({ message: "Temple not found." });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllTemples,
    getSingleTemple,
    createTemple,
    updateTemple,
    deleteTemple
};