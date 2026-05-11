const router = require("express").Router();

// router.use("/", require("./swagger"));

router.get("/", (req, res) => {
    //#swagger.tags = ['Home Page']
    res.send("Welcome to the Home Page!");
});
// router.use("/users", require("./users"));
router.use("/contacts", require("./contacts"));
// router.use("/temples", require("./temples"));

module.exports = router;