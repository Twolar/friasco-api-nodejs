const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = require('./swaggerOptions');

// Require Route Modules
const users = require('./routes/users');
const trips = require('./routes/trips');

const router = express.Router();

// Add Routes to router
router.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerOptions));
router.use('/users', users);
router.use('/trips', trips);

module.exports = router;
