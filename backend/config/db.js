const mongoose = require('mongoose');

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;

  const uri = process.env.MONGO_URI || "mongodb://shrinidhis:shrinidhis@ac-gpcbyet-shard-00-00.k9hw0yo.mongodb.net:27017,ac-gpcbyet-shard-00-01.k9hw0yo.mongodb.net:27017,ac-gpcbyet-shard-00-02.k9hw0yo.mongodb.net:27017/?ssl=true&replicaSet=atlas-ckbsj6-shard-0&authSource=admin&appName=Cluster0";
  await mongoose.connect(uri, { dbName: 'freelancer_marketplace' });
  console.log('Connected to MongoDB Atlas');
}

module.exports = connectDB;
