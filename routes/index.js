const router = require("express").Router();
const passport = require("passport");

// ---------------------------
// Swagger Documentation Route
// ---------------------------
router.use("/api-docs", require("./swagger")); 

// ---------------------------
// API Routes
// ---------------------------
router.use("/students", require("./students"));
router.use("/courses", require("./courses"));
router.use("/department", require("./departments"));
router.use("/teachers", require("./teachers"));

// ---------------------------
// Authentication Routes
// ---------------------------
router.get("/login", passport.authenticate("github"));

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.session.destroy();     // <-- clean logout
    res.redirect("/");
  });
});

// ---------------------------
// Optional home route
// ---------------------------
router.get("/", (req, res) => {
  res.send("Welcome to the School API!");
});

module.exports = router;
