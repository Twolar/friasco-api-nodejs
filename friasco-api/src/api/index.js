const express = require('express');
const logger = require('../utility/logger');

// Require Route Modules
const users = require('./routes/users');
const trips = require('./routes/trips');

const router = express.Router();

// Add Routes to router
router.use('/users', users);
router.use('/trips', trips);

module.exports = router;
