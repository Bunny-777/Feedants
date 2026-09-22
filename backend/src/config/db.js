const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (uri && uri.trim() !== '') {
    try {
      console.log('Connecting to provided MONGODB_URI...');
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log('Connected successfully to MongoDB at:', uri.split('@')[1] || uri);
      return;
    } catch (err) {
      console.warn('Failed to connect to provided MONGODB_URI:', err.message);
      console.log('Falling back to local in-memory MongoDB server for seamless zero-config execution...');
    }
  }

  // Fallback to MongoMemoryServer for instant evaluation without external dependencies
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    console.log('Initializing in-memory MongoDB server...');
    const mongod = await MongoMemoryServer.create();
    const memoryUri = mongod.getUri();
    await mongoose.connect(memoryUri);
    console.log('Connected to In-Memory MongoDB at:', memoryUri);
  } catch (memoryErr) {
    console.error('Failed to initialize in-memory MongoDB:', memoryErr);
    throw memoryErr;
  }
}

module.exports = connectDB;
