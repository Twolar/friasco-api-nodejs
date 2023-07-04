const request = require('supertest');
const server = require('../../server');
const db = require('../../src/utility/database');
const Trip = require('../../src/models/trip');

const baseUrl = '/api/v1';

describe('Trip Routes', () => {
  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    db.initialize();
  });

  afterAll(async () => {
    db.closeConnection();
    server.close();
  });

  describe('Get trips', () => {
    it('should get all trips', async () => {
      const testTrip1 = new Trip(null, 1, 'auckland1', '2023-07-03', '2023-07-06', 'pending1', 'closefriends1')
      const createdTrip1Id = await Trip.createNew(testTrip1);
      testTrip1.id = createdTrip1Id;

      const testTrip2 = new Trip(null, 1, 'auckland2', '2023-07-06', '2023-07-09', 'pending2', 'closefriends2')
      const createdTrip2Id = await Trip.createNew(testTrip2);
      testTrip2.id = createdTrip2Id;

      const res = await request(server)
        .get(`${baseUrl}/trips`)
        .send();

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toEqual('success');
      expect(res.body).toHaveProperty('trips');
      expect(res.body.trips[0]).toEqual(testTrip1);
      expect(res.body.trips[1]).toEqual(testTrip2);
    });

    it('should respond with 204 if no trips', async () => {
      const deleteAllTripRows = (sqlToExecute) => new Promise((resolve, reject) => {
        db.run(sqlToExecute, function (error) {
          if (error) {
            reject(error);
          } else {
            resolve(this.changes);
          }
        });
      });

      const sql = 'DELETE FROM trips';
      const changes = await deleteAllTripRows(sql);

      const res = await request(server)
        .get(`${baseUrl}/trips`)
        .send();

      expect(res.statusCode).toEqual(204);
    });
  });

  describe('Get trip', () => {
    it('should get a single trip', async () => {
      const testTrip = new Trip(null, 1, 'Getauckland2', 'Get2023-07-06', 'Get2023-07-09', 'Getpending2', 'Getclosefriends2')
      const createdTripId = await Trip.createNew(testTrip);
      testTrip.id = createdTripId;

      const res = await request(server)
        .get(`${baseUrl}/trips/${createdTripId}`)
        .send();

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toEqual('success');
      expect(res.body).toHaveProperty('trip');
      expect(res.body.trip).toEqual(testTrip);
    });

    it('should respond with 404 not found if ID does not exist', async () => {
      const res = await request(server)
        .get(`${baseUrl}/trips/956845`)
        .send();

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toEqual('not found');
    });
  });

  describe('Create trip', () => {
    it('should create a single trip', async () => {
      const testTrip = {
        "userId": 1,
        "location": "CreateAuckland", 
        "startDate": "Create2023-07-03",
        "endDate": "Create2023-07-06", 
        "status": "Createplanning", 
        "privacyStatus": "Createclosefriends"
    };

      const res = await request(server)
        .post(`${baseUrl}/trips/new`)
        .send(testTrip);
      const createdTripId = res.body.id;

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toEqual('success');
      expect(res.body).toHaveProperty('id');
      expect(res.body.id).toEqual(createdTripId);
      testTrip.id = createdTripId;

      const tripInDatabase = await Trip.getById(createdTripId);
      expect(tripInDatabase).toEqual(testTrip);
    });
  });

  describe('Update trip', () => {
    it('should update a single trip', async () => {
      const testTrip = {
        "userId": 1,
        "location": "UpdateAuckland", 
        "startDate": "Update2023-07-03",
        "endDate": "Update2023-07-06", 
        "status": "Updateplanning", 
        "privacyStatus": "Updateclosefriends"
      };
      const createdTripId = await Trip.createNew(testTrip);

      const updateTrip = {
        "userId": 1,
        "location": "UpdateAucklandUPDATED", 
        "startDate": "Update2023-07-03UPDATED",
        "endDate": "Update2023-07-06UPDATED", 
        "status": "UpdateplanningUPDATED", 
        "privacyStatus": "UpdateclosefriendsUPDATED"
      };

      const res = await request(server)
        .patch(`${baseUrl}/trips/${createdTripId}`)
        .send(updateTrip);

      updateTrip.id = createdTripId;

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toEqual('success');
      expect(res.body).toHaveProperty('changes');
      expect(res.body.changes).toEqual(1);

      const tripInDatabase = await Trip.getById(createdTripId);
      expect(updateTrip).toEqual(tripInDatabase);
    });

    it('should respond with 404 not found if ID does not exist', async () => {
      const res = await request(server)
        .get(`${baseUrl}/trips/956845`)
        .send();

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toEqual('not found');
    });
  });

  describe('Delete trip', () => {
    it('should delete a single trip', async () => {
      const testTrip = {
        "userId": 1,
        "location": "DeleteAuckland", 
        "startDate": "Delete2023-07-03",
        "endDate": "Delete2023-07-06", 
        "status": "Deleteplanning", 
        "privacyStatus": "Deleteclosefriends"
      };
      const createdTripId = await Trip.createNew(testTrip);
      testTrip.id = createdTripId;

      const res = await request(server)
        .delete(`${baseUrl}/trips/${createdTripId}`)
        .send();

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toEqual('success');
      expect(res.body).toHaveProperty('changes');
      expect(res.body.changes).toEqual(1);

      const deletedTrip = await Trip.getById(createdTripId);
      expect(deletedTrip).toEqual(null);
    });

    it('should respond with 404 not found if ID does not exist', async () => {
      const res = await request(server)
        .delete(`${baseUrl}/trips/956845`)
        .send();

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toEqual('not found');
    });
  });
});
