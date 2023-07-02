require('dotenv').config();
const express = require('express');
const { logger } = require('./src/utility/logger');

const apiBase = require('./src/api');

const app = express();

const port = process.env.PORT || 8000;

app.use(express.json());
app.use('/api/v1', apiBase);
app.use(express.urlencoded());

const server = app.listen(port, () => {
  console.log(`Friasco Application listening on ${port}`);
  logger.info(`Friasco Application listening on ${port}`);
});

module.exports = server;
