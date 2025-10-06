import { connectToWhatsApp } from "./whatsappConnection.js";

process.on("SIGINT", () => {
  console.log("\n[EXIT] Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n[EXIT] Received SIGTERM, shutting down...");
  process.exit(0);
});

process.on("unhandledRejection", (err) => {
  console.error("[FATAL] Unhandled rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("[FATAL] Uncaught exception:", err);
  process.exit(1);
});

console.log("╭─────────────────────────╮");
console.log("│  GitHub Polling Bot v2  │");
console.log("╰─────────────────────────╯\n");

connectToWhatsApp().catch((err) => {
  console.error("[FATAL] Failed to start:", err);
  process.exit(1);
});
