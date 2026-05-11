const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

// GET all contacts
const getAll = async (req, res) => {
    //#swagger.tags=["Contacts"]
    try {
        const db = mongodb.getDb();
        const result = await db.collection("contacts").find().toArray();
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAll };