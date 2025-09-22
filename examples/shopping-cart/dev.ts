#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write --allow-env --unstable-kv

/**
 * Development Server Script
 *
 * Provides a convenient way to run the shopping cart demo with:
 * - Automatic restart on file changes
 * - Environment variable loading
 * - Database initialization
 * - Port configuration
 * - Development-friendly logging
 */

import { existsSync } from "https://deno.land/std@0.224.0/fs/mod.ts";

const PORT = parseInt(Deno.env.get("PORT") || "8080");
const DEV_MODE = Deno.env.get("NODE_ENV") !== "production";

// Development configuration
const config = {
  port: PORT,
  watch: DEV_MODE,
  clearScreen: true,
  logLevel: DEV_MODE ? "info" : "warn",
};

console.log("🛍️ Shopping Cart Demo - Development Server");
console.log("=" .repeat(50));
console.log(`📍 Port: ${config.port}`);
console.log(`🔄 Watch mode: ${config.watch ? "enabled" : "disabled"}`);
console.log(`📝 Log level: ${config.logLevel}`);
console.log("=" .repeat(50));

// Check if Deno KV database exists
const dbPath = "./shopping_cart.db";
if (!existsSync(dbPath)) {
  console.log("📦 Initializing database...");
}

// Set environment variables
Deno.env.set("PORT", config.port.toString());
Deno.env.set("LOG_LEVEL", config.logLevel);
if (DEV_MODE) {
  Deno.env.set("DEBUG", "true");
}

// Build command arguments
const args = [
  "run",
  "--allow-net",
  "--allow-read",
  "--allow-write",
  "--allow-env",
  "--unstable-kv"
];

if (config.watch) {
  args.push("--watch");
}

args.push("./server.tsx");

// Start the server
console.log("🚀 Starting development server...");
console.log(`🌐 Visit: http://localhost:${config.port}`);
console.log("");

const process = new Deno.Command("deno", {
  args,
  stdout: "inherit",
  stderr: "inherit",
  stdin: "inherit"
});

const child = process.spawn();
const status = await child.status;

if (!status.success) {
  console.error("❌ Server failed to start");
  Deno.exit(1);
}