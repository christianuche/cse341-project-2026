const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("./data/database");
require("dotenv").config(); // ✅ Make sure environment variables load



const app = express();
const port = process.env.PORT || 3000; // ✅ Here I will like to Define the port

app.use(bodyParser.json()); // ✅ Middleware to parse JSON bodies
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Z-key"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    next();
})

app.use("/", require("./routes")); // ✅ Route handling

// Initialize the database and start the server

mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {
        // ✅ I used lowercase for the `port` here
        app.listen(port, () => {
            console.log(`Database is listening and Node is running on port ${port}`);
        });
    }
});