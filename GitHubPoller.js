import fs from "fs/promises";
import { CONFIG } from "./config.js";
import { GitHubAPI } from "./githubApi.js";
import { MessageFormatter } from "./messageFormatter.js";
import { getUptime } from "./utils.js";

export class GitHubPoller {
  constructor(sock) {
    this.sock = sock;
    this.lastCommit = null;
    this.isPolling = false;
    this.retryCount = 0;
    this.stats = {
      totalChecks: 0,
      newCommits: 0,
      errors: 0,
      startTime: Date.now(),
    };
  }

  async initialize() {
    try {
      const data = await fs.readFile(CONFIG.LAST_FILE, "utf8");
      this.lastCommit = data.trim();
      console.log(`[INIT] Loaded SHA: ${this.lastCommit?.slice(0, 7) || "none"}`);
    } catch {
      console.log("[INIT] Starting fresh - no previous commit");
    }
  }

  async notifyNewCommit(commit) {
    const details = await GitHubAPI.getCommitDetails(commit.sha);
    const message = MessageFormatter.formatCommitNotification(commit, details);

    await this.sock.sendMessage(CONFIG.TARGET_JID, { text: message });
    
    this.stats.newCommits++;
    console.log(`[✓] Commit sent: ${commit.sha.slice(0, 7)} | Total: ${this.stats.newCommits}`);
  }

  async check() {
    if (this.isPolling) return;
    this.isPolling = true;
    this.stats.totalChecks++;

    try {
      const commit = await GitHubAPI.fetchLatestCommit();
      
      if (!commit) {
        console.log("[CHECK] No commits found");
        return;
      }

      if (commit.sha !== this.lastCommit) {
        this.lastCommit = commit.sha;
        await fs.writeFile(CONFIG.LAST_FILE, commit.sha);
        await this.notifyNewCommit(commit);
        this.retryCount = 0;
      } else {
        process.stdout.write(`\r[CHECK] No new commits | Checks: ${this.stats.totalChecks} | Uptime: ${getUptime(this.stats.startTime)}`);
      }
    } catch (err) {
      this.retryCount++;
      this.stats.errors++;
      console.error(`\n[ERROR] Poll failed (${this.retryCount}/${CONFIG.MAX_RETRIES}): ${err.message}`);

      if (this.retryCount >= CONFIG.MAX_RETRIES) {
        console.warn("[WARN] Max retries reached, resetting counter");
        this.retryCount = 0;
      }
    } finally {
      this.isPolling = false;
      const delay = this.retryCount > 0 ? CONFIG.RETRY_DELAY : CONFIG.POLL_INTERVAL;
      setTimeout(() => this.check(), delay);
    }
  }

  start() {
    console.log(`[POLLER] Started polling every ${CONFIG.POLL_INTERVAL / 1000}s`);
    console.log(`[POLLER] Watching: ${CONFIG.OWNER}/${CONFIG.REPO}@${CONFIG.BRANCH}`);
    this.check();
  }

  printStats() {
    console.log("\n╭─────────────────────────╮");
    console.log("│   POLLING STATISTICS    │");
    console.log("├─────────────────────────┤");
    console.log(`│ Total Checks: ${this.stats.totalChecks}`);
    console.log(`│ New Commits:  ${this.stats.newCommits}`);
    console.log(`│ Errors:       ${this.stats.errors}`);
    console.log(`│ Uptime:       ${getUptime(this.stats.startTime)}`);
    console.log("╰─────────────────────────╯\n");
  }
}
