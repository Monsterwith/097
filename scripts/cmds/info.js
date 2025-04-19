module.exports = {
  config: {
    name: "info",
    version: "1.1",
    author: "Lord Itachi",
    role: 0,
    shortDescription: {
      en: "Stylish info about the bot"
    },
    longDescription: {
      en: "Displays a fancy intro with bot details, stats, and a GIF"
    },
    category: "info",
    guide: {
      en: "{p}about"
    }
  },

  onStart: async function ({ api, event }) {
    const aboutMsg = `
╭─[ 🤖 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎 ]
│📛 𝐍𝐚𝐦𝐞: ITA_CHI👾
│👑 𝐂𝐫𝐞𝐚𝐭𝐨𝐫: Lord Itachi
│⚙️ 𝐕𝐞𝐫𝐬𝐢𝐨𝐧: 1.1.0
│🚀 𝐒𝐭𝐚𝐭𝐮𝐬: Online & Ready
│🌐 𝐔𝐬𝐞𝐝 𝐢𝐧: Groups & Inbox
│💻 𝐏𝐥𝐚𝐭𝐟𝐨𝐫𝐦: Node.js, Custom API
│⚡ 𝐒𝐩𝐞𝐜𝐢𝐚𝐥 𝐅𝐞𝐚𝐭𝐮𝐫𝐞𝐬: Chatbot, File Operations, Games
│🛠️ 𝐋𝐚𝐬𝐭 𝐔𝐩𝐝𝐚𝐭𝐞: [2025-04-19]
╰─────────────────

🗿 Bot Commands Available:
- {p}help: Show available commands
- {p}uptime: Check bot uptime
- {p}daily: Claim daily rewards
- {p}about: Info about the bot

🎨 Bot Styling: Dynamic & Interactive
🔧 Developed by: Lord Itachi`;

    const gifUrl = "https://i.ibb.co/LDGHD4Kj/image.gif"; // cyber bot-style gif

    try {
      api.sendMessage({
        body: aboutMsg,
        attachment: await global.utils.getStreamFromURL(gifUrl)
      }, event.threadID);
    } catch (err) {
      console.log(err);
      api.sendMessage("❌ Failed to send stylish about message.", event.threadID);
    }
  }
};
