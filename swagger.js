const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: "CSE341 REST API",
    description: "A simple REST API for managing the database",
  },
  host: "cse341-project-2026.onrender.com",
  schemes: ["https"],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

//swagger.json will be created here
swaggerAutogen(outputFile, endpointsFiles, doc);