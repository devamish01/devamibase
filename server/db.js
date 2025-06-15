import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongod;

export const connectDB = async () => {
  try {
    if (
      process.env.NODE_ENV === "development" &&
      !process.env.MONGODB_URI?.includes("mongodb://localhost")
    ) {
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
    process.exit(1);
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
