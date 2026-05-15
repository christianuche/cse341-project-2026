const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'CSE341 REST API',
        description: 'A simple REST API for managing the database',
    },
    host: 'localhost:3000',
    schemes: ['http'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

//swagger.json will be created here
swaggerAutogen(outputFile, endpointsFiles, doc);