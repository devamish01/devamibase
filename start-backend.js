import { spawn } from "child_process";
import path from "path";

console.log("🚀 Starting Davami Backend Server...");

// Start the backend server
const backend = spawn("npm", ["run", "dev"], {
  cwd: path.join(process.cwd(), "server"),
  stdio: "inherit",
  shell: true,
});

backend.on("error", (err) => {
  console.error("❌ Failed to start backend server:", err);
});

backend.on("close", (code) => {
  console.log(`❌ Backend server exited with code ${code}`);
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down backend server...");
  backend.kill("SIGINT");
  process.exit(0);
});
