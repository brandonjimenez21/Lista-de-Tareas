// api/config/database.js
import mongoose from "mongoose";

/**
 * Connects the application to the MongoDB database using Mongoose.
 *
 * @async
 * @function connectDB
 * @throws {Error} If an error occurs while attempting to connect to MongoDB.
 * @returns {Promise<void>} A promise that resolves when the connection is successful.
 *
 * @example
 * import connectDB from "./config/database.js";
 *
 * // Initialize MongoDB connection
 * connectDB().then(() => {
 *   console.log("Database connected");
 * }).catch(err => {
 *   console.error("Connection error:", err);
 * });
 */

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB conectado exitosamente");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;  // 👈 Exportar por defecto