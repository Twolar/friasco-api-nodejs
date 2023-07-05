const express = require('express');
const logger = require('../../utility/logger');
const User = require('../../models/user');

const router = express.Router();

// User management/these routes subject to change and is currently acting as a placeholder
// As not looking to reinvent the wheel with user management
// But should be good enough for now to build everything else we need off of it for mvp...

// GetUsers
router.get('/', async (req, res, next) => {
  logger.info('UsersRoute::GetUsers - Initiated');
  try {
    const users = await User.getAll();

    if (users.length > 0) {
      logger.info('UsersRoute::GetUsers - Success');
      res.status(200).json({
        message: 'success',
        users,
      });
    } else {
      logger.info('UsersRoute::GetUsers - No users found');
      res.status(204).json();
    }
  } catch (error) {
    logger.error(`UsersRoute::GetUsers - Failed: ${error}`);
    res.status(400).json({
      message: error.message,
    });
    next(error);
  }
  logger.info('UsersRoute::GetUsers - Finished');
});

// GetUser
router.get('/:id', async (req, res, next) => {
  logger.info('UsersRoute::GetUser - Initiated');
  try {
    const user = await User.getById(req.params.id);

    if (user) {
      logger.info('UsersRoute::GetUser - Success');
      res.status(200).json({
        message: 'success',
        user,
      });
    } else {
      logger.info('UsersRoute::GetUser - User not found');
      res.status(404).json({
        message: 'not found',
      });
    }
  } catch (error) {
    logger.error(`UsersRoute::GetUser - Failed: ${error}`);
    res.status(400).json({
      message: error.message,
    });
    next(error);
  }
  logger.info('UsersRoute::GetUser - Finished');
});

// NewUser
router.post('/new', async (req, res, next) => {
  logger.info('UsersRoute::NewUser - Initiated');
  try {
    const createdUserId = await User.createNew(req.body.email, req.body.username, req.body.password);

    if (createdUserId) {
      logger.info('UsersRoute::NewUser - Success');
      res.status(201).json({
        message: 'success',
        id: createdUserId,
      });
    } else {
      logger.info('UsersRoute::NewUser - Something went wrong');
      res.status(500).json({
        message: 'internal server error',
      });
    }
  } catch (error) {
    logger.error(`UsersRoute::NewUser - Failed: ${error}`);
    res.status(400).json({
      message: error.message,
    });
    next(error);
  }
  logger.info('UsersRoute::NewUser - Finished');
});

// UpdateUser
router.patch('/:id', async (req, res, next) => {
  logger.info('UsersRoute::UpdateUser - Initiated');
  try {
    const changes = await User.updateById(req.params.id, req.body.email, req.body.username, req.body.password);

    if (changes) {
      logger.info('UsersRoute::UpdateUser - Success');
      res.send({
        message: 'success',
        changes,
      });
    } else if (changes === 0) {
      logger.info('UsersRoute::UpdateUser - No row was changed');
      res.status(404).json({
        message: 'not found',
      });
    } else {
      logger.info('UsersRoute::UpdateUser - Something went wrong');
      res.status(500).json({
        message: 'internal server error',
      });
    }
  } catch (error) {
    logger.error(`UsersRoute::UpdateUser - Failed: ${error}`);
    res.status(400).json({
      message: error.message,
    });
    next(error);
  }
  logger.info('UsersRoute::UpdateUser - Finished');
});

// DeleteUser
router.delete('/:id', async (req, res, next) => {
  logger.info('UsersRoute::DeleteUser - Initiated');
  try {
    const changes = await User.deleteById(req.params.id);

    if (changes) {
      logger.info('UsersRoute::DeleteUser - Success');
      res.send({
        message: 'success',
        changes,
      });
    } else if (changes === 0) {
      logger.info('UsersRoute::DeleteUser - User not found');
      res.status(404).json({
        message: 'not found',
      });
    } else {
      logger.info('UsersRoute::DeleteUser - Something went wrong');
      res.status(500).json({
        message: 'internal server error',
      });
    }
  } catch (error) {
    logger.error(`UsersRoute::DeleteUser - Failed: ${error}`);
    res.status(400).json({
      message: error.message,
    });
    next(error);
  }
  logger.info('UsersRoute::DeleteUser - Finished');
});

module.exports = router;
