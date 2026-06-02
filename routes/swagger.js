const router = require("express").Router();
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("../swagger.json");

// Serve Swagger UI directly at "/"
router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerFile));

module.exports = router;
