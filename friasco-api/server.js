require('dotenv').config();
const express = require('express');
const logger = require('./src/utility/logger');

const apiBase = require('./src/api');

const app = express();

const port = process.env.PORT || 8000;

app.use(express.json());
app.use('/api/v1', apiBase);
app.use((req, res) => {
  logger.info('Server::404 - Initiated');
  res.status(404).json({
    message: 'does not exist',
  });
  logger.info('Server::404 - Finished');
});
app.use(express.urlencoded());

const server = app.listen(port, () => {
  logger.info(`Friasco Application listening on ${port}`);
});

module.exports = server;
