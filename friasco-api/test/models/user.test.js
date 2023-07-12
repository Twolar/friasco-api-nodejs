const User = require('../../src/models/user');
const db = require('../../src/utility/database');

jest.mock('pino', () => () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

describe('User Model', () => {
  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    db.initialize();
  });

  afterAll(async () => {
    db.closeConnection();
  });

  describe('getAll', () => {
    it('should get all users', async () => {
      const usersToInsert = [
        { email: 'test1@test.com', username: 'test1', password: '123' },
        { email: 'test2@test.com', username: 'test2', password: '1234' },
        { email: 'test3@test.com', username: 'test3', password: '12345' },
      ];
      const values = usersToInsert.map((user) => `('${user.email}', '${user.username}', '${user.password}')`).join(',');
      const sql = `INSERT INTO users (email, username, password) VALUES ${values}`;
      db.run(sql, () => {});

      const usersFetched = await User.getAll();
      const usersFetchedWithoutIds = usersFetched.map(({ id, ...user }) => user);
      expect(usersToInsert).toEqual(usersFetchedWithoutIds);
    });
  });

  describe('getById', () => {
    it('should get a user by id', async () => {
      const insertUser = { email: 'testid1@test.com', username: 'testid1', password: 'id123' };
      const sql = `INSERT INTO users (email, username, password) VALUES ('${insertUser.email}', '${insertUser.username}', '${insertUser.password}')`;

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
      const userFetched = await User.getById(lastInsertedId);
      delete userFetched.id;
      expect(insertUser).toEqual(userFetched);
    });
  });

  describe('createNew', () => {
    it('should create a new user', async () => {
      const createUser = { email: 'testid1@test.com', username: 'testid1', password: 'id123' };
      const createUserId = await User.createNew(createUser.email, createUser.username, createUser.password);
      createUser.id = createUserId;

      const getUser = (sqlToExecute) => new Promise((resolve, reject) => {
        db.get(sqlToExecute, (error, row) => {
          if (error) {
            reject(error);
          } else {
            resolve(row);
          }
        });
      });

      const sql = `SELECT * FROM users WHERE id = ${createUserId}`;
      const databaseUser = await getUser(sql);
      expect(databaseUser).toEqual(createUser);
    });
  });

  describe('updateById', () => {
    it('should update a user by id', async () => {
      const updateUser = { email: 'testid1@test.com', username: 'testid1', password: 'id123' };
      const initialInsertSql = 'INSERT INTO users (email, username, password) VALUES (\'updateEmail@test.com\', \'updateUsername\', \'updatePassword\')';

      const insertAndGetLastId = (sqlToExecute) => new Promise((resolve, reject) => {
        db.run(sqlToExecute, function (error) {
          if (error) {
            reject(error);
          } else {
            resolve(this.lastID);
          }
        });
      });
      const lastInsertedId = await insertAndGetLastId(initialInsertSql);

      await User.updateById(lastInsertedId, updateUser.email, updateUser.username, updateUser.password);

      const getUser = (sqlToExecute) => new Promise((resolve, reject) => {
        db.get(sqlToExecute, (error, row) => {
          if (error) {
            reject(error);
          } else {
            resolve(row);
          }
        });
      });
      const getUserSql = `SELECT * FROM users WHERE id = ${lastInsertedId}`;
      const databaseUser = await getUser(getUserSql);
      delete databaseUser.id;

      expect(databaseUser).toEqual(updateUser);
    });
  });

  describe('deleteById', () => {
    it('should delete a user by id', async () => {
      const insertUser = { email: 'testid1@test.com', username: 'testid1', password: 'id123' };
      const sql = `INSERT INTO users (email, username, password) VALUES ('${insertUser.email}', '${insertUser.username}', '${insertUser.password}')`;

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

      await User.deleteById(lastInsertedId);

      const getUser = (sqlToExecute) => new Promise((resolve, reject) => {
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
      const getUserSql = `SELECT * FROM users WHERE id = ${lastInsertedId}`;
      const databaseUser = await getUser(getUserSql);

      expect(databaseUser).toEqual(null);
    });
  });
});
