// const mongoose = require('mongoose');
// require('dotenv').config();

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
//     console.log('MongoDB connected');
//   } catch (error) {
//     console.error('Database connection error:', error);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;


const mongoose = require('mongoose');
require('dotenv').config();

// mongodb+srv://at604281:wetware9211@dashboarddb.ysw862b.mongodb.net/Student-Dashboard-dev

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });

    console.log('MongoDB connected');

    // Get the MongoDB server version
    const admin = connection.connection.db.admin();
    const info = await admin.buildInfo(); // Use buildInfo to get server details
    console.log(`MongoDB engine version: ${info.version}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;

