//1........................................
//  import mongoose from "mongoose";

// const connectDB = async()=>{
//     try{
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log("Mongodb connected successfully");
//     }catch(error){
//         console.log(error);

//     }
// }
// export default connectDB;

//2.......................................
// config/db.js
// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     // Set the strictQuery option to true or false based on your preference
//     mongoose.set('strictQuery', true);

//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log('MongoDB connected');
//   } catch (error) {
//     console.error('MongoDB connection failed', error);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;


//3............................
// utils/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true); // or false, based on your preference

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed', error);
    process.exit(1);
  }
};

export default connectDB;
