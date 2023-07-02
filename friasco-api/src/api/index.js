const express = require('express');

// Require Route Modules
const users = require('./routes/users');

const router = express.Router();

// Add Routes to router
router.use('/users', users);
router.use('/', (req, res) => {
  res.json({
    message: 'success',
    tempFeedback: 'ApiBase',
  });
});

module.exports = router;
