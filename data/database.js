const dotenv = require("dotenv");
dotenv.config();

const { MongoClient } = require("mongodb");

let _db;

const initDb = (callback) => {
    if (_db) {
        console.log("Database is already initialized!");
        return callback(null, _db);
    }

    MongoClient.connect(process.env.MONGODB_URL)
        .then((client) => {
            _db = client.db(); // ✅ use the actual DB, not just the client
            console.log("Connected to MongoDB!");
            callback(null, _db);
        })
        .catch((err) => {
            callback(err);
        });
};

const getDb = () => {
    if (!_db) {
        throw Error("Database is not initialized!");
    }
    return _db;
};

module.exports = {
    initDb,
    getDb,
};