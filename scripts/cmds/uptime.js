module.exports = {
  config: {
    name: "uptime",
    aliases: ["upt", "up"],
    version: "1.0",
    author: "OtinXSandip",
    role: 0,
    shortDescription: {
      en: "Displays the total number of users of the bot and checks uptime."
    },
    longDescription: {
      en: "Displays the total number of users who have interacted with the bot and check uptime."
    },
    category: "system",
    guide: {
      en: "Use {p}uptime to display the total number of users of the bot and check uptime."
    }
  },
  onStart: async function ({ api, event, usersData, threadsData }) {
    try {
      // Retrieve all users and threads data
      const allUsers = await usersData.getAll();
      const allThreads = await threadsData.getAll();
      
      // Calculate uptime in days, hours, minutes, seconds
      const uptime = process.uptime();
      const days = Math.floor(uptime / 86400);
      const hours = Math.floor((uptime % 86400) / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);

      const uptimeString = `${days} days ${hours}Hrs ${minutes}min ${seconds}sec`;
      
      // Send the message with uptime and user/threads data
      api.sendMessage(
        `⏰ | Bot running time\n☞ ${uptimeString}\n\n👪 | Total Users\n☞ ${allUsers.length}\n🌸 | Total threads\n☞ ${allThreads.length}`,
        event.threadID
      );
    } catch (error) {
      console.error(error);
      api.sendMessage("An error occurred while retrieving data.", event.threadID);
    }
  }
};
