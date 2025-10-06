import fetch from "node-fetch";
import { CONFIG } from "./config.js";

export class GitHubAPI {
  static getHeaders() {
    const headers = {
      "User-Agent": "GitHub-Polling-Bot",
      "Accept": "application/vnd.github.v3+json",
    };

    if (CONFIG.GITHUB_TOKEN) {
      headers["Authorization"] = `token ${CONFIG.GITHUB_TOKEN}`;
    }

    return headers;
  }

  static async fetchLatestCommit() {
    const res = await fetch(
      `https://api.github.com/repos/${CONFIG.OWNER}/${CONFIG.REPO}/commits?sha=${CONFIG.BRANCH}&per_page=1`,
      { headers: this.getHeaders(), timeout: 15_000 }
    );

    if (!res.ok) {
      const remaining = res.headers.get("x-ratelimit-remaining");
      const reset = res.headers.get("x-ratelimit-reset");
      
      if (res.status === 403 && remaining === "0") {
        const resetDate = new Date(reset * 1000);
        throw new Error(`Rate limit exceeded. Reset at ${resetDate.toLocaleTimeString()}`);
      }
      
      throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
    }

    const commits = await res.json();
    return commits[0];
  }

  static async getCommitDetails(sha) {
    try {
      const res = await fetch(
        `https://api.github.com/repos/${CONFIG.OWNER}/${CONFIG.REPO}/commits/${sha}`,
        { headers: this.getHeaders(), timeout: 10_000 }
      );

      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn("[WARN] Failed to fetch commit details:", err.message);
    }
    return null;
  }
}
