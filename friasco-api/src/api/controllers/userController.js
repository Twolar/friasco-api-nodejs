const logger = require('../../utility/logger');
const User = require('../../models/user');

const getUsers = async (req, res, next) => {
  logger.info('userController::GetUsers - Initiated');
  try {
    const users = await User.getAll();

    if (users.length > 0) {
      logger.info('userController::GetUsers - Success');
      res.status(200).json({
        message: 'success',
        users,
      });
    } else {
      logger.info('userController::GetUsers - No users found');
      res.status(204).json();
    }
  } catch (error) {
    logger.error(`userController::GetUsers - Failed: ${error}`);
    next(error);
  }
  logger.info('userController::GetUsers - Finished');
};

const getUser = async (req, res, next) => {
  logger.info('userController::GetUser - Initiated');
  try {
    const user = await User.getById(req.params.id);

    if (user) {
      logger.info('userController::GetUser - Success');
      res.status(200).json({
        message: 'success',
        user,
      });
    } else {
      logger.info('userController::GetUser - User not found');
      res.status(404).json({
        message: 'not found',
      });
    }
  } catch (error) {
    logger.error(`userController::GetUser - Failed: ${error}`);
    next(error);
  }
  logger.info('userController::GetUser - Finished');
};

const newUser = async (req, res, next) => {
  logger.info('userController::NewUser - Initiated');
  try {
    const createdUserId = await User.createNew(req.body.email, req.body.username, req.body.password);

    if (createdUserId) {
      logger.info('userController::NewUser - Success');
      res.status(201).json({
        message: 'success',
        id: createdUserId,
      });
    } else {
      logger.info('userController::NewUser - Something went wrong');
      res.status(400).json({
        message: 'something went wrong',
      });
    }
  } catch (error) {
    logger.error(`userController::NewUser - Failed: ${error}`);
    next(error);
  }
  logger.info('userController::NewUser - Finished');
};

const updateUser = async (req, res, next) => {
  logger.info('userController::UpdateUser - Initiated');
  try {
    const changes = await User.updateById(req.params.id, req.body.email, req.body.username, req.body.password);

    if (changes) {
      logger.info('userController::UpdateUser - Success');
      res.send({
        message: 'success',
        changes,
      });
    } else if (changes === 0) {
      logger.info('userController::UpdateUser - No row was changed');
      res.status(404).json({
        message: 'not found',
      });
    } else {
      logger.info('userController::UpdateUser - Something went wrong');
      res.status(400).json({
        message: 'something went wrong',
      });
    }
  } catch (error) {
    logger.error(`userController::UpdateUser - Failed: ${error}`);
    next(error);
  }
  logger.info('userController::UpdateUser - Finished');
};

const deleteUser = async (req, res, next) => {
  logger.info('userController::DeleteUser - Initiated');
  try {
    const changes = await User.deleteById(req.params.id);

    if (changes) {
      logger.info('userController::DeleteUser - Success');
      res.send({
        message: 'success',
        changes,
      });
    } else if (changes === 0) {
      logger.info('userController::DeleteUser - User not found');
      res.status(404).json({
        message: 'not found',
      });
    } else {
      logger.info('userController::DeleteUser - Something went wrong');
      res.status(400).json({
        message: 'something went wrong',
      });
    }
  } catch (error) {
    logger.error(`userController::DeleteUser - Failed: ${error}`);
    next(error);
  }
  logger.info('userController::DeleteUser - Finished');
};

module.exports = {
  getUsers,
  getUser,
  newUser,
  updateUser,
  deleteUser,
};
