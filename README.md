# 🤖 WhatsApp GitHub Notifier

> Real-time GitHub commit notifications delivered straight to your WhatsApp

[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-active-success.svg)]()

## 📝 Description

Automated bot that monitors GitHub repositories and sends real-time WhatsApp notifications on new commits. Built with Node.js and Baileys, featuring auto-reconnect, rate limit handling, and detailed commit stats. Perfect for teams wanting instant repository updates.

## ✨ Features

- 🔔 **Real-time notifications** - Get instant alerts on new commits
- 📊 **Detailed stats** - View additions, deletions, and files changed
- 🔄 **Auto-reconnect** - Handles disconnections gracefully
- 🌐 **Rate limit handling** - Smart GitHub API rate limit management
- 📱 **WhatsApp integration** - Uses Baileys for stable connections
- 🎯 **Modular architecture** - Clean, maintainable code structure
- 🛡️ **Error recovery** - Automatic retry mechanism on failures

## 📋 Prerequisites

- Node.js 18 or higher
- WhatsApp account
- GitHub repository access
- GitHub Personal Access Token (optional, for higher rate limits)

## 🚀 Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/whatsapp-github-notifier.git
cd whatsapp-github-notifier
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure the bot**

Edit `config.js` with your settings:

```javascript
export const CONFIG = {
  OWNER: "YourGitHubUsername",
  REPO: "YourRepoName",
  BRANCH: "main",
  TARGET_JID: "628xxxxxxxxxx@s.whatsapp.net",
  POLL_INTERVAL: 60_000,
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || null,
};
```

4. **Set up environment variables** (optional)

Create `.env` file:
```env
GITHUB_TOKEN=your_github_personal_access_token
```

5. **Run the bot**
```bash
npm start
```

6. **Scan QR Code**

Open WhatsApp on your phone and scan the QR code displayed in the terminal.

## 📁 Project Structure

```
whatsapp-github-notifier/
├── config.js              # Configuration settings
├── utils.js               # Utility functions
├── githubApi.js           # GitHub API handler
├── messageFormatter.js    # Message formatting
├── GitHubPoller.js        # Polling logic
├── whatsappConnection.js  # WhatsApp connection handler
├── index.js               # Application entry point
├── package.json           # Dependencies
└── README.md             # Documentation
```

## 🔧 Configuration Options

| Option | Description | Default |
|--------|-------------|---------|
| `OWNER` | GitHub repository owner | - |
| `REPO` | Repository name to monitor | - |
| `BRANCH` | Branch to track | `main` |
| `TARGET_JID` | WhatsApp number (format: 628xxx@s.whatsapp.net) | - |
| `POLL_INTERVAL` | Check interval in milliseconds | `60000` (1 min) |
| `MAX_RETRIES` | Maximum retry attempts on failure | `3` |
| `RETRY_DELAY` | Delay between retries (ms) | `5000` |
| `GITHUB_TOKEN` | GitHub Personal Access Token | `null` |

## 📱 Getting WhatsApp JID

To get your WhatsApp JID (number format):

1. Your number: `+62 812-3456-7890`
2. Remove spaces and hyphens: `6281234567890`
3. Add `@s.whatsapp.net`: `6281234567890@s.whatsapp.net`

## 🔑 GitHub Token Setup

For higher API rate limits (5000 requests/hour vs 60):

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Generate new token (classic)
3. Select scope: `public_repo` or `repo`
4. Copy token and add to `.env` file

## 📊 Notification Format

```
╭─ NEW COMMIT ─╮
│
├ 📦 Repo: YourRepo
├ 🔖 SHA: a1b2c3d
├ 👤 Author: username
├ 🕐 06/10/25, 14:30
│
├ 📊 Stats:
│   • 3 files changed
│   • 45 additions (+)
│   • 12 deletions (-)
│
├ 💬 Message:
│   Fix: Update authentication logic
│
╰─ 🔗 https://github.com/...
```

## 🛠️ Commands

```bash
# Start the bot
npm start

# Development mode with auto-reload
npm run dev
```

## 🔍 Monitoring

The bot provides real-time statistics:

- Total API checks performed
- Number of new commits detected
- Error count
- Uptime duration

Stats are printed every 30 minutes automatically.

## 🐛 Troubleshooting

### Bot not receiving notifications

1. Check if polling is active in console
2. Verify GitHub repository settings
3. Check rate limit status
4. Ensure WhatsApp is connected

### QR code not appearing

1. Delete `session` folder
2. Restart the bot
3. Scan new QR code

### Connection drops frequently

1. Check internet stability
2. Verify WhatsApp phone is online
3. Check if phone number is not logged in elsewhere

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Baileys](https://github.com/WhiskeySockets/Baileys) - WhatsApp Web API
- [GitHub REST API](https://docs.github.com/en/rest) - Repository data
- [Node.js](https://nodejs.org/) - Runtime environment

## 📧 Contact

For questions or support, please open an issue on GitHub.

## ⭐ Star History

If you find this project useful, please consider giving it a star!

---

Made with ❤️ by Vryptt - VryptLabs
