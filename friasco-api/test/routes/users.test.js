const request = require('supertest');
const server = require('../../server');
const db = require('../../src/utility/database');
const User = require('../../src/models/user');

jest.mock('pino', () => () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

const baseUrl = '/v1';

describe('User Routes', () => {
  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    db.initialize();
  });

  afterAll(async () => {
    db.closeConnection();
    server.close();
  });

  describe('Get users', () => {
    it('should get all users', async () => {
      const testUser1 = {
        email: 'getUsers1@test.com',
        username: 'getUser1s',
        password: 'getUsersPassword1',
      };
      const createdUser1Id = await User.createNew(testUser1.email, testUser1.username, testUser1.password);
      testUser1.id = createdUser1Id;

      const testUser2 = {
        email: 'getUsers2@test.com',
        username: 'getUsers2',
        password: 'getUsersPassword2',
      };
      const createdUser2Id = await User.createNew(testUser2.email, testUser2.username, testUser2.password);
      testUser2.id = createdUser2Id;

      const res = await request(server)
        .get(`${baseUrl}/users`)
        .send();

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toEqual('success');
      expect(res.body).toHaveProperty('users');
      expect(res.body.users[0]).toEqual(testUser1);
      expect(res.body.users[1]).toEqual(testUser2);
    });

    it('should respond with 204 if no users', async () => {
      const deleteAllUserRows = (sqlToExecute) => new Promise((resolve, reject) => {
        db.run(sqlToExecute, function (error) {
          if (error) {
            reject(error);
          } else {
            resolve(this.changes);
          }
        });
      });

      const sql = 'DELETE FROM users';
      await deleteAllUserRows(sql);

      const res = await request(server)
        .get(`${baseUrl}/users`)
        .send();

      expect(res.statusCode).toEqual(204);
    });
  });

  describe('Get user', () => {
    it('should get a single user', async () => {
      const testUser = {
        email: 'getUser@test.com',
        username: 'getUser',
        password: 'getUserPassword',
      };
      const createdUserId = await User.createNew(testUser.email, testUser.username, testUser.password);
      testUser.id = createdUserId;

      const res = await request(server)
        .get(`${baseUrl}/users/${createdUserId}`)
        .send();

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toEqual('success');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toEqual(testUser);
    });

    it('should respond with 404 not found if ID does not exist', async () => {
      const res = await request(server)
        .get(`${baseUrl}/users/956845`)
        .send();

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toEqual('not found');
    });
  });

  describe('Create user', () => {
    it('should create a single user', async () => {
      const testUser = {
        email: 'createUser@test.com',
        username: 'createUser',
        password: 'createUserPassword',
      };

      const res = await request(server)
        .post(`${baseUrl}/users/new`)
        .send(testUser);
      const createdUserId = res.body.id;

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toEqual('success');
      expect(res.body).toHaveProperty('id');
      expect(res.body.id).toEqual(createdUserId);
      testUser.id = createdUserId;

      const userInDatabase = await User.getById(createdUserId);
      expect(userInDatabase).toEqual(testUser);
    });
  });

  describe('Update user', () => {
    it('should update a single user', async () => {
      const testUser = {
        email: 'updateUser@test.com',
        username: 'updateUser',
        password: 'updateUserPassword',
      };
      const createdUserId = await User.createNew(testUser.email, testUser.username, testUser.password);

      const updateUser = {
        email: 'updateUser@test.comUPDATED',
        username: 'updateUserUPDATED',
        password: 'updateUserPasswordUPDATED',
      };

      const res = await request(server)
        .patch(`${baseUrl}/users/${createdUserId}`)
        .send(updateUser);

      updateUser.id = createdUserId;

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toEqual('success');
      expect(res.body).toHaveProperty('changes');
      expect(res.body.changes).toEqual(1);

      const userInDatabase = await User.getById(createdUserId);
      expect(updateUser).toEqual(userInDatabase);
    });

    it('should respond with 404 not found if ID does not exist', async () => {
      const res = await request(server)
        .get(`${baseUrl}/users/956845`)
        .send();

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toEqual('not found');
    });
  });

  describe('Delete user', () => {
    it('should delete a single user', async () => {
      const testUser = {
        email: 'deleteUser@test.com',
        username: 'deleteUser',
        password: 'deleteUserPassword',
      };
      const createdUserId = await User.createNew(testUser.email, testUser.username, testUser.password);
      testUser.id = createdUserId;

      const res = await request(server)
        .delete(`${baseUrl}/users/${createdUserId}`)
        .send();

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toEqual('success');
      expect(res.body).toHaveProperty('changes');
      expect(res.body.changes).toEqual(1);

      const deletedUser = await User.getById(createdUserId);
      expect(deletedUser).toEqual(null);
    });

    it('should respond with 404 not found if ID does not exist', async () => {
      const res = await request(server)
        .delete(`${baseUrl}/users/956845`)
        .send();

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toEqual('not found');
    });
  });
});
