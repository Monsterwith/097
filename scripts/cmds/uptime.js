module.exports = {
  config: {
    name: "uptime",
    aliases: ["upt", "up"],
    version: "2.0",
    author: "Lord Itachi",
    role: 0,
    shortDescription: {
      en: "Shows bot uptime and usage stats"
    },
    longDescription: {
      en: "Displays how long the bot has been running, along with total user and thread counts"
    },
    category: "system",
    guide: {
      en: "Use {p}uptime to check bot status"
    }
  },

  onStart: async function ({ api, event, usersData, threadsData }) {
    try {
      const allUsers = await usersData.getAll();
      const allThreads = await threadsData.getAll();

      const uptime = process.uptime();
      const days = Math.floor(uptime / 86400);
      const hours = Math.floor((uptime % 86400) / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);

      const formattedUptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;

      const msg = 
`───「 BOT STATUS 」───
⏱ Uptime    : ${formattedUptime}
👤 Users     : ${allUsers.length}
💬 Threads   : ${allThreads.length}
────────────────────`;

      const gifUrl = "https://i.ibb.co/LDGHD4Kj/image.gif"; // You can change this

      api.sendMessage({
        body: msg,
        attachment: await global.utils.getStreamFromURL(gifUrl)
      }, event.threadID);
    } catch (error) {
      console.error(error);
      api.sendMessage("⚠️ An error occurred while retrieving uptime info.", event.threadID);
    }
  }
};
