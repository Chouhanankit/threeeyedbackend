const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`DB CONNECTION IS SUCCESSFUL: ${conn.connection.host}`);
  } catch (error) {
    console.error("DB CONNECTION FAILED:", error.message);
    throw error;
  }
};

module.exports = { connectDB };
