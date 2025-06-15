import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongod;

export const connectDB = async () => {
  try {
    // Check if we can connect to local MongoDB first
    const useMemoryDB =
      process.env.NODE_ENV === "development" ||
      process.env.USE_MEMORY_DB === "true";

    if (useMemoryDB) {
      // Use in-memory MongoDB for development
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      console.log("🚀 Starting in-memory MongoDB...");
      await mongoose.connect(uri);
      console.log("✅ Connected to in-memory MongoDB");
    } else {
      // Use regular MongoDB connection
      const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/davami";
      await mongoose.connect(uri);
      console.log("✅ Connected to MongoDB");
    }
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);

    // Fallback to in-memory if regular connection fails
    try {
      console.log("🔄 Falling back to in-memory MongoDB...");
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log("✅ Connected to in-memory MongoDB (fallback)");
    } catch (fallbackError) {
      console.error(
        "❌ Failed to connect to in-memory MongoDB:",
        fallbackError,
      );
      process.exit(1);
    }
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
    console.log("📦 Disconnected from MongoDB");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
  }
};
