const db = require('../../src/utility/database');

jest.mock('pino', () => () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

describe('SQLite Database Initialisation', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test';
    return db.initialize();
  });

  afterAll(() => {
    db.closeConnection();
  });

  it('should create the users table', async () => {
    const checkDatabaseTable = () => new Promise((resolve, reject) => {
      db.get('SELECT name FROM sqlite_master WHERE type=\'table\' AND name=\'users\'', (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          resolve(row);
        } else {
          reject(new Error('Users table not found'));
        }
      });
    });

    const result = await checkDatabaseTable();
    expect(result.name).toEqual('users');
  });

  it('should create the trips table', async () => {
    const checkDatabaseTable = () => new Promise((resolve, reject) => {
      db.get('SELECT name FROM sqlite_master WHERE type=\'table\' AND name=\'trips\'', (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          resolve(row);
        } else {
          reject(new Error('Trips table not found'));
        }
      });
    });

    const result = await checkDatabaseTable();
    expect(result.name).toEqual('trips');
  });
});
