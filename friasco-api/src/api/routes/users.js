const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// User management/these routes subject to change and is currently acting as a placeholder
// As not looking to reinvent the wheel with user management
// But should be good enough for now to build everything else we need off of it for mvp...

/**
 * @openapi
 * /users/:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - users
 *     responses:
 *       200:
 *         description:  Gets all users.
 */
router.get('/', userController.getUsers);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Get a single user
 *     tags:
 *       - users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Get a single user
 */
router.get('/:id', userController.getUser);

/**
 * @openapi
 * /users/new:
 *   post:
 *     summary: Add new user
 *     tags:
 *       - users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                email:
 *                 type: string
 *                 description: user email address
 *                 example: 'test@test.com'
 *                username:
 *                 type: string
 *                 description: username
 *                 example: ddot
 *                password:
 *                 type: string
 *                 description: user password
 *                 example: OwenWilsonWow
 *     responses:
 *       201:
 *         description: Add new user
 */
router.post('/new', userController.newUser);

/**
 * @openapi
 * /users/{id}:
 *   patch:
 *     summary: Update existing user details based on ID
 *     tags:
 *       - users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                email:
 *                 type: string
 *                 description: user email address
 *                 example: 'test@test.com'
 *                username:
 *                 type: string
 *                 description: username
 *                 example: ddot
 *     responses:
 *       200:
 *         description: Update existing user
 */
router.patch('/:id', userController.updateUser);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Delete existing user based on ID
 *     tags:
 *       - users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Delete existing user based on ID
 */
router.delete('/:id', userController.deleteUser);

module.exports = router;
