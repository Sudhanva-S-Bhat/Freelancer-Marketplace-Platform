const mongoose = require('mongoose');

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not set in the environment');
  }
  await mongoose.connect(uri, { dbName: 'freelancer_marketplace' });
  console.log('Connected to MongoDB Atlas');
}

module.exports = connectDB;
