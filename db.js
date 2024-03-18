const MongoClient = require('mongodb').MongoClient;

let dbConnection;

module.exports = {
  connectToDb: (uri) => {
    return MongoClient.connect("mongodb://127.0.0.1:27017/bookstore")
      .then((client) => {
        dbConnection = client.db();
        console.log('Connected to database');
      })
      .catch(err => {
        console.error('Failed to connect to database:', err);
        throw err; // Re-throw the error to be caught by the caller
      });
  },
  getDb: () => dbConnection
}