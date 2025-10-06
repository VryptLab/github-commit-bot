import makeWASocket, { useMultiFileAuthState, Browsers, DisconnectReason } from "baileys";
import { Boom } from "@hapi/boom";
import pino from "pino";
import { CONFIG } from "./config.js";
import { GitHubPoller } from "./GitHubPoller.js";

const logger = pino({ level: "silent" });

export async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState(CONFIG.SESSION_DIR);
  
  const sock = makeWASocket({
    logger,
    printQRInTerminal: false,
    browser: Browsers.macOS("Edge"),
    auth: state,
    connectTimeoutMs: 60_000,
    defaultQueryTimeoutMs: 0,
    keepAliveIntervalMs: 10_000,
    markOnlineOnConnect: false,
    syncFullHistory: false,
  });
  
  if(!sock.authState.creds.registered) {
    try {
      setTimeout(async () => {
        const code = await sock.requestPairingCode(CONFIG.PAIRING_NUMBER)
        console.log("[INFO] Your Cods Is: " + code)
      }, 2000)
    } catch (e) {
      console.error("[ERROR] " + e.message)
    }
  }

  sock.ev.on("creds.update", saveCreds);

  let poller;

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("[QR] Scan QR code to login");
    }

    if (connection === "close") {
      const shouldReconnect =
        (lastDisconnect?.error instanceof Boom)
          ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
          : true;

      const reason = lastDisconnect?.error?.message || "Unknown";
      console.log(`[CONN] Connection closed: ${reason}`);

      if (shouldReconnect) {
        console.log("[CONN] Reconnecting in 5s...");
        setTimeout(() => connectToWhatsApp(), 5000);
      } else {
        console.log("[CONN] Logged out. Delete session folder and restart.");
        process.exit(0);
      }
    } else if (connection === "open") {
      console.log("[CONN] ✓ WhatsApp connected");
      
      poller = new GitHubPoller(sock);
      await poller.initialize();
      poller.start();

      setInterval(() => poller.printStats(), 1800_000);
    }
  });

  return sock;
}
