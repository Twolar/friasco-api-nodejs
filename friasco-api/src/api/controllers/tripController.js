const logger = require('../../utility/logger');
const Trip = require('../../models/trip');

const getTrips = async (req, res, next) => {
  logger.info('tripController::GetTrips - Initiated');
  try {
    const trips = await Trip.getAll();

    if (trips.length > 0) {
      logger.info('tripController::GetTrips - Success');
      res.status(200).json({
        message: 'success',
        trips,
      });
    } else {
      logger.info('tripController::GetTrips -  No trips found');
      res.status(204).json();
    }
  } catch (error) {
    logger.error(`tripController::GetTrips - Failed: ${error}`);
    next(error);
  }
  logger.info('tripController::GetTrips - Finished');
};

const getTrip = async (req, res, next) => {
  logger.info('tripController::GetTrip - Initiated');
  try {
    const trip = await Trip.getById(req.params.id);

    if (trip) {
      logger.info('tripController::GetTrip - Success');
      res.status(200).json({
        message: 'success',
        trip,
      });
    } else {
      logger.info('tripController::GetTrip - Trip not found');
      res.status(404).json({
        message: 'not found',
      });
    }
  } catch (error) {
    logger.error(`tripController::GetTrip - Failed: ${error}`);
    next(error);
  }
  logger.info('tripController::GetTrip - Finished');
};

const newTrip = async (req, res, next) => {
  logger.info('tripController::NewTrip - Initiated');
  try {
    const newTripData = new Trip(null, req.body.userId, req.body.location, req.body.startDate, req.body.endDate, req.body.status, req.body.privacyStatus);
    const createdTripId = await Trip.createNew(newTripData);

    if (createdTripId) {
      logger.info('tripController::NewTrip - Success');
      res.status(201).json({
        message: 'success',
        id: createdTripId,
      });
    } else {
      logger.info('tripController::NewTrip - Something went wrong');
      res.status(400).json({
        message: 'something went wrong',
      });
    }
  } catch (error) {
    logger.error(`tripController::NewTrip - Failed: ${error}`);
    next(error);
  }
  logger.info('tripController::NewTrip - Finished');
};

const updateTrip = async (req, res, next) => {
  logger.info('tripController::UpdateTrip - Initiated');
  try {
    const updateTripData = new Trip(req.params.id, req.body.userId, req.body.location, req.body.startDate, req.body.endDate, req.body.status, req.body.privacyStatus);
    const changes = await Trip.updateById(updateTripData);

    if (changes) {
      logger.info('tripController::UpdateTrip - Success');
      res.send({
        message: 'success',
        changes,
      });
    } else if (changes === 0) {
      logger.info('tripController::UpdateTrip - No row was changed');
      res.status(404).json({
        message: 'not found',
      });
    } else {
      logger.info('tripController::UpdateTrip - Something went wrong');
      res.status(400).json({
        message: 'something went wrong',
      });
    }
  } catch (error) {
    logger.error(`tripController::UpdateTrip - Failed: ${error}`);
    next(error);
  }
  logger.info('tripController::UpdateTrip - Finished');
};

const deleteTrip = async (req, res, next) => {
  logger.info('tripController::DeleteTrip - Initiated');
  try {
    const changes = await Trip.deleteById(req.params.id);

    if (changes) {
      logger.info('tripController::DeleteTrip - Success');
      res.send({
        message: 'success',
        changes,
      });
    } else if (changes === 0) {
      logger.info('tripController::DeleteTrip - Trip not found');
      res.status(404).json({
        message: 'not found',
      });
    } else {
      logger.info('tripController::DeleteTrip - Something went wrong');
      res.status(400).json({
        message: 'something went wrong',
      });
    }
  } catch (error) {
    logger.error(`tripController::DeleteTrip - Failed: ${error}`);
    next(error);
  }
  logger.info('tripController::DeleteTrip - Finished');
};

module.exports = {
  getTrips,
  getTrip,
  newTrip,
  updateTrip,
  deleteTrip,
};
