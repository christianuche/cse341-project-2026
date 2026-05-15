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

// GET one contact
const getSingle = async (req, res) => {
    //#swagger.tags=["Contacts"]
    try {
        const contactId = new ObjectId(req.params.id);
        const db = mongodb.getDb();
        const result = await db.collection("contacts").findOne({ _id: contactId });
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// // Create a new contact
const createContact = async (req, res) => {
    //#swagger.tags=["Contacts"]
    try {
        const contact = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            favoriteColor: req.body.favoriteColor,
            birthday: req.body.birthday,
        };

        const db = mongodb.getDb(); // ✅ no .db()
        const response = await db.collection("contacts").insertOne(contact);

        if (response.acknowledged) {
            res.status(201).json({ message: "Contact created successfully", id: response.insertedId });
        } else {
            res.status(500).json({ message: "Failed to create contact" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update an existing contact
const updateContact = async (req, res) => {
    //#swagger.tags=["Contacts"]
    try {
        const userId = new ObjectId(req.params.id);
        const contact = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            favoriteColor: req.body.favoriteColor,
            birthday: req.body.birthday,
        };

        const db = mongodb.getDb();
        const response = await db.collection("contacts").replaceOne({ _id: userId }, contact);

        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json({ message: "No contact updated or contact not found." });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete a contact
const deleteContact = async (req, res) => {
    //#swagger.tags=["Contacts"]
    try {
        const userId = new ObjectId(req.params.id);
        const db = mongodb.getDb();
        const response = await db.collection("contacts").deleteOne({ _id: userId });

        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Contact not found." });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAll,
    getSingle,
    createContact,
    updateContact,
    deleteContact
};