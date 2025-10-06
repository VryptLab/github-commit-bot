export const CONFIG = {
  PAIRING_NUMBER: "62882003353414",
  OWNER: "VryptLab",
  REPO: "EternityBot",
  BRANCH: "main",
  TARGET_JID: "62882005514880@s.whatsapp.net",
  POLL_INTERVAL: 1_000,
  LAST_FILE: "./last_commit.txt",
  SESSION_DIR: "./session",
  MAX_RETRIES: 3,
  RETRY_DELAY: 5_000,
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || null,
};
