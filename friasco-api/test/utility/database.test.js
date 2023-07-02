const db = require('../../src/utility/database');

describe('SQLite Database Initialisation Tests', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test';
    return db.initialize();
  });

  afterAll(() => {
    db.closeConnection();
  });

  it('should create the users table', () => new Promise((resolve, reject) => {
    db.get('SELECT name FROM sqlite_master WHERE type=\'table\' AND name=\'users\'', (err, row) => {
      if (err) {
        reject(err);
      } else if (row) {
        resolve();
      } else {
        reject(new Error('Users table not found'));
      }
    });
  }));
});
