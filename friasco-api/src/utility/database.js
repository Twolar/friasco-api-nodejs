const sqlite3 = require('sqlite3').verbose();
const { logger } = require('./logger');

const dbSource = process.env.DBSOURE || 'friasco.db';

let db;

if (process.env.NODE_ENV === 'test') {
  db = new sqlite3.Database(':memory:');
  logger.info('Database::constructor - Created and connected to test memory database successfully');
} else {
  db = new sqlite3.Database(dbSource, (err) => {
    if (err) {
      logger.err(`Database::constructor - ${err.message}`);
      throw err;
    } else {
      logger.info(`Database::constructor - Connected to ${dbSource} database successfully`);
      db.initialize();
    }
  });
}

db.initialize = () => {
  db.serialize(() => {
    initializeUserTable();
    initializeTripTable();
  });
};

db.closeConnection = () => {
  db.close((err) => {
    if (err) {
      logger.error(`Database::close - ${err.message}`);
    } else {
      logger.info(`Database::close - Closed connection to ${dbSource} database successfully`);
    }
  });
};

function initializeUserTable() {
  const createUserTableSQL = `
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT,
        username TEXT,
        password TEXT
    )
  `;
  db.run(createUserTableSQL, (err) => {
    if (err) {
      logger.info(`Database::initializeUserTable - ${err.message}`);
    } else {
      logger.info('Database::initializeUserTable - Creating fresh users table');
    }
  });
}

function initializeTripTable() {
  const createTripTableSQL = `
    CREATE TABLE IF NOT EXISTS trips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      location TEXT,
      start_date TEXT,
      end_date TEXT,
      status TEXT,
      privacy_status TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `;
  db.run(createTripTableSQL, (err) => {
    if (err) {
      logger.info(`Database::initializeTripTable - ${err.message}`);
    } else {
      logger.info('Database::initializeTripTable - Creating fresh trips table');
    }
  });
}

module.exports = db;
