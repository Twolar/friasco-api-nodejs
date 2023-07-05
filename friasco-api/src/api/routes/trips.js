const express = require('express');
const logger = require('../../utility/logger');
const Trip = require('../../models/trip');

const router = express.Router();

// GetTrips
router.get('/', async (req, res, next) => {
  logger.info('TripsRoute::GetTrips - Initiated');
  try {
    const trips = await Trip.getAll();

    if (trips.length > 0) {
      logger.info('TripsRoute::GetTrips - Success');
      res.status(200).json({
        message: 'success',
        trips,
      });
    } else {
      logger.info('TripsRoute::GetTrips -  No trips found');
      res.status(204).json();
    }
  } catch (error) {
    logger.error(`TripsRoute::GetTrips - Failed: ${error}`);
    next(error);
  }
  logger.info('TripsRoute::GetTrips - Finished');
});

// GetTrip
router.get('/:id', async (req, res, next) => {
  logger.info('TripsRoute::GetTrip - Initiated');
  try {
    const trip = await Trip.getById(req.params.id);

    if (trip) {
      logger.info('TripsRoute::GetTrip - Success');
      res.status(200).json({
        message: 'success',
        trip,
      });
    } else {
      logger.info('TripsRoute::GetTrip - Trip not found');
      res.status(404).json({
        message: 'not found',
      });
    }
  } catch (error) {
    logger.error(`TripsRoute::GetTrip - Failed: ${error}`);
    next(error);
  }
  logger.info('TripsRoute::GetTrip - Finished');
});

// NewTrip
router.post('/new', async (req, res, next) => {
  logger.info('TripsRoute::NewTrip - Initiated');
  try {
    const newTripData = new Trip(null, req.body.userId, req.body.location, req.body.startDate, req.body.endDate, req.body.status, req.body.privacyStatus);
    const createdTripId = await Trip.createNew(newTripData);

    if (createdTripId) {
      logger.info('TripsRoute::NewTrip - Success');
      res.status(201).json({
        message: 'success',
        id: createdTripId,
      });
    } else {
      logger.info('TripsRoute::NewTrip - Something went wrong');
      res.status(400).json({
        message: 'something went wrong',
      });
    }
  } catch (error) {
    logger.error(`TripsRoute::NewTrip - Failed: ${error}`);
    next(error);
  }
  logger.info('TripsRoute::NewTrip - Finished');
});

// UpdateTrip
router.patch('/:id', async (req, res, next) => {
  logger.info('TripsRoute::UpdateTrip - Initiated');
  try {
    const updateTripData = new Trip(req.params.id, req.body.userId, req.body.location, req.body.startDate, req.body.endDate, req.body.status, req.body.privacyStatus);
    const changes = await Trip.updateById(updateTripData);

    if (changes) {
      logger.info('TripsRoute::UpdateTrip - Success');
      res.send({
        message: 'success',
        changes,
      });
    } else if (changes === 0) {
      logger.info('TripsRoute::UpdateTrip - No row was changed');
      res.status(404).json({
        message: 'not found',
      });
    } else {
      logger.info('TripsRoute::UpdateTrip - Something went wrong');
      res.status(400).json({
        message: 'something went wrong',
      });
    }
  } catch (error) {
    logger.error(`TripsRoute::UpdateTrip - Failed: ${error}`);
    next(error);
  }
  logger.info('TripsRoute::UpdateTrip - Finished');
});

// DeleteTrip
router.delete('/:id', async (req, res, next) => {
  logger.info('TripsRoute::DeleteTrip - Initiated');
  try {
    const changes = await Trip.deleteById(req.params.id);

    if (changes) {
      logger.info('TripsRoute::DeleteTrip - Success');
      res.send({
        message: 'success',
        changes,
      });
    } else if (changes === 0) {
      logger.info('TripsRoute::DeleteTrip - Trip not found');
      res.status(404).json({
        message: 'not found',
      });
    } else {
      logger.info('TripsRoute::DeleteTrip - Something went wrong');
      res.status(400).json({
        message: 'something went wrong',
      });
    }
  } catch (error) {
    logger.error(`TripsRoute::DeleteTrip - Failed: ${error}`);
    next(error);
  }
  logger.info('TripsRoute::DeleteTrip - Finished');
});

module.exports = router;
