import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const setupDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_DATABASE_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('DB connected');
  } catch (error) {
    console.log('DB connection error', error);
  }
};

export default setupDB;
