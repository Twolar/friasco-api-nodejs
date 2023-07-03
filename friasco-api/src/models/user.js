const db = require('../utility/database');

class User {
  constructor(id, email, username, password) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.password = password;
  }

  static async getAll() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users';
      db.all(query, (error, rows) => {
        if (error) {
          reject(error);
        } else if (!rows) {
          resolve(null);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async getById(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users WHERE id = ?';
      db.get(query, id, (error, row) => {
        if (error) {
          reject(error);
        } else if (!row) {
          resolve(null);
        } else {
          const user = new User(row.id, row.email, row.username, row.password);
          resolve(user);
        }
      });
    });
  }

  static async createNew(email, username, password) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO users (email, username, password) VALUES (?, ?, ?)';
      db.run(query, [email, username, password], function (error) {
        if (error) {
          reject(error);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }

  static async updateById(id, email, username, password) {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE users SET email = ?, username = ?, password = ? WHERE id = ?';
      db.run(query, [email, username, password, id], function (error) {
        if (error) {
          reject(error);
        } else {
          resolve(this.changes);
        }
      });
    });
  }

  static async deleteById(id) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM users WHERE id = ?';
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

module.exports = User;
