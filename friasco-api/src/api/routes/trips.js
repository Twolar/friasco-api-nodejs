const express = require('express');
const { logger } = require('../../utility/logger');
const Trip = require('../../models/trip');

const router = express.Router();

// GetTrips
router.get('/', async (req, res) => {
  logger.info('Trips::GetTrips - Initiated');
  try {
    const trips = await Trip.getAll();

    if (trips.length > 0) {
      res.status(200).json({
        message: 'success',
        trips,
      });
    } else {
      res.status(204).json();
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
    logger.error(`Trips::GetTrips - Failed: ${error}`);
    return;
  }
  logger.info('Trips::GetTrips - Finished');
});

// GetTrip
router.get('/:id', async (req, res) => {
  logger.info('Trips::GetTrip - Initiated');
  try {
    const trip = await Trip.getById(req.params.id);

    if (trip) {
      res.status(200).json({
        message: 'success',
        trip,
      });
    } else {
      res.status(404).json({
        message: 'not found',
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
    logger.error(`Trips::GetTrip - Failed: ${error}`);
    return;
  }
  logger.info('Trips::GetTrip - Finished');
});

// NewTrip
router.post('/new', async (req, res) => {
  logger.info('Trips::NewTrip - Initiated');
  try {
    const newTripData = new Trip(null, req.body.userId, req.body.location, req.body.startDate, req.body.endDate, req.body.status, req.body.privacyStatus);
    const createdTripId = await Trip.createNew(newTripData);

    if (createdTripId) {
      res.status(201).json({
        message: 'success',
        id: createdTripId,
      });
    } else {
      res.status(500).json({
        message: 'internal server error',
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
    logger.error(`Trips::NewTrip - Failed: ${error}`);
    return;
  }
  logger.info('Trips::NewTrip - Finished');
});

// UpdateTrip
router.patch('/:id', async (req, res) => {
  logger.info('Trips::UpdateTrip - Initiated');
  try {
    const updateTripData = new Trip(req.params.id, req.body.userId, req.body.location, req.body.startDate, req.body.endDate, req.body.status, req.body.privacyStatus);
    const changes = await Trip.updateById(updateTripData);

    if (changes) {
      res.send({
        message: 'success',
        changes,
      });
    } else if (changes === 0) {
      res.status(404).json({
        message: 'not found',
      });
    } else {
      res.status(500).json({
        message: 'internal server error',
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
    logger.error(`Trips::UpdateTrip - Failed: ${error}`);
    return;
  }
  logger.info('Trips::UpdateTrip - Finished');
});

// DeleteTrip
router.delete('/:id', async (req, res) => {
  logger.info('Trips::DeleteTrip - Initiated');
  try {
    const changes = await Trip.deleteById(req.params.id);

    if (changes) {
      res.send({
        message: 'success',
        changes,
      });
    } else if (changes === 0) {
      res.status(404).json({
        message: 'not found',
      });
    } else {
      res.status(500).json({
        message: 'internal server error',
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
    logger.error(`Trips::DeleteTrip - Failed: ${error}`);
    return;
  }
  logger.info('Trips::DeleteTrip - Finished');
});

module.exports = router;
