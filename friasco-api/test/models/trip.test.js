const Trip = require('../../src/models/trip');
const db = require('../../src/utility/database');

describe('Trip Model', () => {
  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    return db.initialize();
  });

  afterAll(async () => {
    db.closeConnection();
  });

  describe('getAll', () => {
    it('should get all trips', async () => {
      const tripsToInsert = [
        {
          userId: 1,
          location: 'getAll1Auckland',
          startDate: 'getAll12023-07-03',
          endDate: 'getAll12023-07-06',
          status: 'getAll1planning',
          privacyStatus: 'getAll1closefriends',
        },
        {
          userId: 1,
          location: 'getAll2Auckland',
          startDate: 'getAll22023-07-03',
          endDate: 'getAll22023-07-06',
          status: 'getAll2planning',
          privacyStatus: 'getAll2closefriends',
        },
      ];
      const values = tripsToInsert.map((trip) => `('${trip.userId}', '${trip.location}', '${trip.startDate}', '${trip.endDate}', '${trip.status}', '${trip.privacyStatus}')`).join(',');
      const sql = `INSERT INTO trips (user_id, location, start_date, end_date, status, privacy_status) VALUES ${values}`;
      db.run(sql, (error) => {});

      const tripsFetched = await Trip.getAll();
      tripsFetched.forEach((trip) => {
        delete trip.id;
      });
      expect(tripsToInsert).toEqual(tripsFetched);
    });
  });

  describe('getById', () => {
    it('should get a trip by id', async () => {
      const insertTrip = {
        userId: 1,
        location: 'getByIdAuckland',
        startDate: 'getById2023-07-03',
        endDate: 'getById2023-07-06',
        status: 'getByIdplanning',
        privacyStatus: 'getByIdclosefriends',
      };

      const insertAndGetLastId = (sqlToExecute) => new Promise((resolve, reject) => {
        db.run(sqlToExecute, function (error) {
          if (error) {
            reject(error);
          } else {
            resolve(this.lastID);
          }
        });
      });

      const sql = `INSERT INTO trips (user_id, location, start_date, end_date, status, privacy_status) VALUES ('${insertTrip.userId}', '${insertTrip.location}', '${insertTrip.startDate}', '${insertTrip.endDate}', '${insertTrip.status}', '${insertTrip.privacyStatus}')`;
      const lastInsertedId = await insertAndGetLastId(sql);

      const tripFetched = await Trip.getById(lastInsertedId);
      delete tripFetched.id;
      expect(insertTrip).toEqual(tripFetched);
    });
  });

  describe('createNew', () => {
    it('should create a new trip', async () => {
      const createTrip = {
        userId: 1,
        location: 'createAuckland',
        startDate: 'create2023-07-03',
        endDate: 'create2023-07-06',
        status: 'createplanning',
        privacyStatus: 'createclosefriends',
      };
      const createTripId = await Trip.createNew(createTrip);
      createTrip.id = createTripId;

      const getTrip = (sqlToExecute) => new Promise((resolve, reject) => {
        db.get(sqlToExecute, (error, row) => {
          if (error) {
            reject(error);
          } else {
            const trip = new Trip(row.id, row.user_id, row.location, row.start_date, row.end_date, row.status, row.privacy_status);
            resolve(trip);
          }
        });
      });

      const sql = `SELECT * FROM trips WHERE id = ${createTripId}`;
      const databaseTrip = await getTrip(sql);
      expect(databaseTrip).toEqual(createTrip);
    });
  });

  describe('updateById', () => {
    it('should update a trip by id', async () => {
      const updateTrip = {
        userId: 1,
        location: 'updateAuckland',
        startDate: 'update2023-07-03',
        endDate: 'update2023-07-06',
        status: 'updateplanning',
        privacyStatus: 'updateclosefriends',
      };

      const insertAndGetLastId = (sqlToExecute) => new Promise((resolve, reject) => {
        db.run(sqlToExecute, function (error) {
          if (error) {
            reject(error);
          } else {
            resolve(this.lastID);
          }
        });
      });

      const initialInsertSql = 'INSERT INTO trips (user_id, location, start_date, end_date, status, privacy_status) VALUES (1, \'location\', \'start_date\', \'end_date\', \'status\', \'privacy_status\')';
      const lastInsertedId = await insertAndGetLastId(initialInsertSql);

      updateTrip.id = lastInsertedId;
      await Trip.updateById(updateTrip);

      const getTrip = (sqlToExecute) => new Promise((resolve, reject) => {
        db.get(sqlToExecute, (error, row) => {
          if (error) {
            reject(error);
          } else {
            const trip = new Trip(row.id, row.user_id, row.location, row.start_date, row.end_date, row.status, row.privacy_status);
            resolve(trip);
          }
        });
      });
      const getTripSql = `SELECT * FROM trips WHERE id = ${lastInsertedId}`;
      const databaseTrip = await getTrip(getTripSql);

      expect(databaseTrip).toEqual(updateTrip);
    });
  });

  describe('deleteById', () => {
    it('should delete a trip by id', async () => {
      const insertTrip = {
        userId: 1,
        location: 'deleteAuckland',
        startDate: 'delete2023-07-03',
        endDate: 'delete2023-07-06',
        status: 'deleteplanning',
        privacyStatus: 'deleteclosefriends',
      };
      const sql = `INSERT INTO trips (user_id, location, start_date, end_date, status, privacy_status) VALUES ('${insertTrip.userId}', '${insertTrip.location}', '${insertTrip.startDate}', '${insertTrip.endDate}', '${insertTrip.status}', '${insertTrip.privacyStatus}')`;

      const insertAndGetLastId = (sqlToExecute) => new Promise((resolve, reject) => {
        db.run(sqlToExecute, function (error) {
          if (error) {
            reject(error);
          } else {
            resolve(this.lastID);
          }
        });
      });
      const lastInsertedId = await insertAndGetLastId(sql);

      await Trip.deleteById(lastInsertedId);

      const getTrip = (sqlToExecute) => new Promise((resolve, reject) => {
        db.get(sqlToExecute, (error, row) => {
          if (error) {
            reject(error);
          } if (!row) {
            resolve(null);
          } else {
            resolve(row);
          }
        });
      });
      const getTripSql = `SELECT * FROM trips WHERE id = ${lastInsertedId}`;
      const databaseTrip = await getTrip(getTripSql);

      expect(databaseTrip).toEqual(null);
    });
  });
});
