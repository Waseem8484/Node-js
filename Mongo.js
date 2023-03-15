const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const database = "test";

// mango methed

const dbconnect = async () => {
  const results = await client.connect();
  const db = await results.db(database);
  return db.collection("inventory");
};

module.exports = dbconnect;
