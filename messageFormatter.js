import { CONFIG } from "./config.js";
import { truncate } from "./utils.js";

export class MessageFormatter {
  static formatCommitNotification(commit, details) {
    const { sha, commit: info, html_url, author: githubAuthor } = commit;
    const date = new Date(info.author.date).toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
      dateStyle: "short",
      timeStyle: "short",
    });

    const stats = details?.stats || {};
    const additions = stats.additions || 0;
    const deletions = stats.deletions || 0;
    const totalChanges = additions + deletions;
    const filesChanged = stats.total || 0;

    const lines = [
      `╭─ *NEW COMMIT* ─╮`,
      `│`,
      `├ 📦 Repo: *${CONFIG.REPO}*`,
      `├ 🔖 SHA: \`${sha.slice(0, 7)}\``,
      `├ 👤 Author: ${githubAuthor?.login || info.author.name}`,
      `├ 🕐 ${date}`,
    ];

    if (totalChanges > 0) {
      lines.push(`│`);
      lines.push(`├ 📊 Stats:`);
      lines.push(`│   • ${filesChanged} file${filesChanged !== 1 ? 's' : ''} changed`);
      lines.push(`│   • ${additions} additions (+)`);
      lines.push(`│   • ${deletions} deletions (-)`);
    }

    lines.push(`│`);
    lines.push(`├ 💬 Message:`);
    lines.push(`│   ${truncate(info.message, 80)}`);
    lines.push(`│`);
    lines.push(`╰─ 🔗 ${html_url}`);

    return lines.join("\n");
  }
}
