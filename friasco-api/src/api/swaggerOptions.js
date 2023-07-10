const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Friasco API',
      version: '1.0.0',
    },
    servers: [
      {
        url: '/api/v1',
        description: 'Default',
      },
    ],
  },
  apis: [ // files containing swagger annotations
    './src/api/routes/users.js',
    './src/api/routes/trips.js',
  ],
};

const openapiSpecification = swaggerJsdoc(swaggerOptions);

module.exports = openapiSpecification;
