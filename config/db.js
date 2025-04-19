// const mongoose = require('mongoose');
// const mongoDB = "mongodb://localhost:27017/meiso"; // Replace with your database URI

// // Optional: Set Mongoose settings like this to suppress warnings
// mongoose.set("strictQuery", false);

// async function connectDB() {
//     try {
//       await mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
//       console.log("Connected to MongoDB");
//     } catch (error) {
//       console.error("MongoDB connection error:", error);
//     }
//   }
  
//   connectDB();
  const mongoose = require('mongoose');

  const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  };
  
  module.exports = connectDB;
  