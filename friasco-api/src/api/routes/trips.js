const express = require('express');
const tripController = require('../controllers/tripController');

const router = express.Router();

/**
 * @openapi
 * /trips/:
 *   get:
 *     summary: Get all trips
 *     tags:
 *       - trips
 *     responses:
 *       200:
 *         description:  Gets all trips.
 */
router.get('/', tripController.getTrips);

/**
 * @openapi
 * /trips/{id}:
 *   get:
 *     summary: Get a single trip
 *     tags:
 *       - trips
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the trip to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Get a single trip
 */
router.get('/:id', tripController.getTrip);

/**
 * @openapi
 * /trips/new:
 *   post:
 *     summary: Add new trip
 *     tags:
 *       - trips
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                userId:
 *                 type: int
 *                 description: ID of user trip associated with
 *                 example: 1
 *                location:
 *                 type: string
 *                 description: Location of the trip
 *                 example: 'Auckland'
 *                startDate:
 *                 type: string
 *                 description: Start date of the trip
 *                 example: '2023-07-03'
 *                endDate:
 *                 type: string
 *                 description: End date of the trip
 *                 example: '2023-07-25'
 *                status:
 *                 type: string
 *                 description: Status of the trip
 *                 example: 'planning'
 *                privacyStatus:
 *                 type: string
 *                 description: Status of the trip
 *                 example: 'closefriends'
 *     responses:
 *       201:
 *         description: Add new trip
 */
router.post('/new', tripController.newTrip);

/**
 * @openapi
 * /trips/{id}:
 *   patch:
 *     summary: Update existing trip details based on ID
 *     tags:
 *       - trips
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the trip to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                userId:
 *                 type: int
 *                 description: ID of user trip associated with
 *                 example: 1
 *                location:
 *                 type: string
 *                 description: Location of the trip
 *                 example: 'Wellington'
 *                startDate:
 *                 type: string
 *                 description: Start date of the trip
 *                 example: '2023-08-09'
 *                endDate:
 *                 type: string
 *                 description: End date of the trip
 *                 example: '2023-08-22'
 *                status:
 *                 type: string
 *                 description: Status of the trip
 *                 example: 'lockedin'
 *                privacyStatus:
 *                 type: string
 *                 description: Status of the trip
 *                 example: 'everyone'
 *     responses:
 *       200:
 *         description: Update existing trip
 */
router.patch('/:id', tripController.updateTrip);

/**
 * @openapi
 * /trips/{id}:
 *   delete:
 *     summary: Delete existing trip based on ID
 *     tags:
 *       - trips
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the trip to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Delete existing trip based on ID
 */
router.delete('/:id', tripController.deleteTrip);

module.exports = router;
