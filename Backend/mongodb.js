const { MongoClient } = require('mongodb');
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbName = 'ngo';

async function dbconnect() {
  const result = await client.connect();
  const db = client.db(dbName);
  return db.collection('ngo');
}

module.exports = dbconnect;
