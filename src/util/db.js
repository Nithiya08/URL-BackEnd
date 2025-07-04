import mongoose from "mongoose";
import dotenv from "dotenv";



dotenv.config();

export const connectDB = async () => {
    try {
        const db = await mongoose.connect(process.env.DB_URL);
        console.log(`MongoDB connected: ${db.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);

    }
}