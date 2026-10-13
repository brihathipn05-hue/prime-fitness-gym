const mongoose = require('mongoose');

// Connect to MongoDB Atlas with automatic local fallback
const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/prime_fitness_gym';
  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`\n⚠️  Error connecting to MongoDB Atlas (${uri}):\n   ${error.message}\n`);
    
    // Automatic fallback to local MongoDB if Atlas connection fails (e.g. DNS SRV issue or bad URI)
    if (uri !== 'mongodb://127.0.0.1:27017/prime_fitness_gym') {
      console.log('🔄 Attempting fallback connection to local MongoDB (mongodb://127.0.0.1:27017/prime_fitness_gym)...');
      try {
        const localConn = await mongoose.connect('mongodb://127.0.0.1:27017/prime_fitness_gym');
        console.log(`✅ Local MongoDB Connected: ${localConn.connection.host}\n`);
        return;
      } catch (localErr) {
        console.error(`❌ Local MongoDB connection also failed: ${localErr.message}`);
      }
    }
    process.exit(1);
  }
};

module.exports = connectDB;
