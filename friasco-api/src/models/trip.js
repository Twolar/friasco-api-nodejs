const db = require('../utility/database');
const logger = require('../utility/logger');

class Trip {
  constructor(id, userId, location, startDate, endDate, status, privacyStatus) {
    logger.info('Trip::constructor - Initiated');
    this.id = id;
    this.userId = userId;
    this.location = location;
    this.startDate = startDate;
    this.endDate = endDate;
    this.status = status;
    this.privacyStatus = privacyStatus;
  }

  static async getAll() {
    logger.info('Trip::GetAll - Initiated');
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM trips';
      db.all(query, (error, rows) => {
        if (error) {
          reject(error);
        } else if (!rows) {
          resolve(null);
        } else {
          const trips = rows.map((row) => new Trip(row.id, row.user_id, row.location, row.start_date, row.end_date, row.status, row.privacy_status));
          resolve(trips);
        }
      });
    });
  }

  static async getById(id) {
    logger.info('Trip::getById - Initiated');
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM trips WHERE id = ?';
      db.get(query, id, (error, row) => {
        if (error) {
          reject(error);
        } else if (!row) {
          resolve(null);
        } else {
          const trip = new Trip(row.id, row.user_id, row.location, row.start_date, row.end_date, row.status, row.privacy_status);
          resolve(trip);
        }
      });
    });
  }

  static async createNew(tripData) {
    logger.info('Trip::createNew - Initiated');
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO trips (user_id, location, start_date, end_date, status, privacy_status) VALUES (?, ?, ?, ?, ?, ?)';
      db.run(
        query,
        [tripData.userId, tripData.location, tripData.startDate, tripData.endDate, tripData.status, tripData.privacyStatus],
        function (error) {
          if (error) {
            reject(error);
          } else {
            resolve(this.lastID);
          }
        },
      );
    });
  }

  static async updateById(tripData) {
    logger.info('Trip::updateById - Initiated');
    return new Promise((resolve, reject) => {
      const query = 'UPDATE trips SET user_id = ?, location = ?, start_date = ?, end_date = ?, status = ?, privacy_status = ? WHERE id = ?';
      db.run(
        query,
        [tripData.userId, tripData.location, tripData.startDate, tripData.endDate, tripData.status, tripData.privacyStatus, tripData.id],
        function (error) {
          if (error) {
            reject(error);
          } else {
            resolve(this.changes);
          }
        },
      );
    });
  }

  static async deleteById(id) {
    logger.info('Trip::deleteById - Initiated');
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM trips WHERE id = ?';
      db.run(query, id, function (error) {
        if (error) {
          reject(error);
        } else {
          resolve(this.changes);
        }
      });
    });
  }
}

module.exports = Trip;
