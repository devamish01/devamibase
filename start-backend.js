#!/usr/bin/env node

import { spawn, exec } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🚀 Starting Davami Backend Server...");
console.log("=================================");

// Check if we're in the right directory
if (!fs.existsSync("server")) {
  console.error(
    "❌ Error: Please run this script from the project root directory",
  );
  process.exit(1);
}

// Navigate to server directory
process.chdir("server");

async function runCommand(command, description) {
  return new Promise((resolve, reject) => {
    console.log(`${description}...`);

    const child = spawn(command, {
      shell: true,
      stdio: "inherit",
      cwd: process.cwd(),
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });

    child.on("error", (error) => {
      reject(error);
    });
  });
}

async function setupBackend() {
  try {
    // Check if node_modules exists
    if (!fs.existsSync("node_modules")) {
      console.log("📦 Installing dependencies...");
      await runCommand("npm install", "Installing packages");
    }

    // Check if .env exists
    if (!fs.existsSync(".env")) {
      console.log("⚙️  Creating environment file...");
      fs.copyFileSync(".env.example", ".env");
      console.log("✅ Created .env file - you may want to customize it");
    }

    // Seed database
    console.log("🌱 Seeding database with sample data...");
    await runCommand("npm run seed", "Seeding database");

    console.log("");
    console.log("🎉 Backend setup complete!");
    console.log("");
    console.log("📋 Next steps:");
    console.log("1. The backend server is starting on http://localhost:5000");
    console.log("2. Go to your frontend app (http://localhost:8080)");
    console.log("3. Click 'Check Again' in the demo notification");
    console.log("4. You'll now have full eCommerce functionality!");
    console.log("");
    console.log("🔑 Default admin credentials:");
    console.log("   Email: admin@davami.com");
    console.log("   Password: admin123");
    console.log("");
    console.log("📖 For production deployment, see PRODUCTION_DEPLOYMENT.md");
    console.log("");

    // Start the development server
    console.log("🚀 Starting backend server...");
    console.log("Press Ctrl+C to stop the server");
    console.log("");

    const server = spawn("npm", ["run", "dev"], {
      stdio: "inherit",
      shell: true,
    });

    // Handle graceful shutdown
    process.on("SIGINT", () => {
      console.log("\n🛑 Shutting down backend server...");
      server.kill("SIGINT");
      process.exit(0);
    });

    server.on("close", (code) => {
      console.log(`\n🔴 Backend server stopped with code ${code}`);
      process.exit(code);
    });
  } catch (error) {
    console.error("❌ Setup failed:", error.message);
    process.exit(1);
  }
}

setupBackend();
