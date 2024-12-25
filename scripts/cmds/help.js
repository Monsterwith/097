const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "2.0",
    author: "Itachiffx",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "View bot commands and usage",
    },
    longDescription: {
      en: "View a list of all commands or get detailed information about a specific command.",
    },
    category: "info",
    guide: {
      en: "{pn}help [commandName]",
    },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    const prefix = getPrefix(threadID);

    if (args.length === 0) {
      const categories = {};
      let msg = `🌐 **ITACHI COMMAND LIST** 🌐\n`;

      for (const [name, value] of commands) {
        if (value.config.role > role) continue;

        const category = value.config.category || "Uncategorized";
        if (!categories[category]) categories[category] = [];
        categories[category].push(name);
      }

      Object.keys(categories).forEach((category) => {
        msg += `\n╭── ${category.toUpperCase()} ──╮`;
        const cmdList = categories[category].sort();
        msg += cmdList.map((cmd) => `\n│ 🔹 ${cmd}`).join("");
        msg += `\n╰──────────────────╯\n`;
      });

      msg += `\n💡 **Total Commands:** ${commands.size}`;
      msg += `\n📖 **Type "${prefix}help [command]" to get details of a command.**`;
      msg += `\n🛠 **Bot by: ITACHI | 🖤**`;

      const helpImages = [
        "https://i.ibb.co/6ZtnN6Q/image.gif", // Replace with other image URLs if necessary
      ];

      const selectedImage = helpImages[Math.floor(Math.random() * helpImages.length)];

      await message.reply({
        body: msg,
        attachment: await global.utils.getStreamFromURL(selectedImage),
      });
    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(`❌ Command "${commandName}" not found.`);
      } else {
        const config = command.config;
        const roleDescription = roleToText(config.role);
        const description = config.longDescription?.en || "No description available.";
        const usage = config.guide?.en.replace(/{pn}/g, prefix).replace(/{n}/g, config.name) || "No usage guide available.";
        const aliasesText = config.aliases?.length ? config.aliases.join(", ") : "None";

        const response = `╭── **COMMAND DETAILS** ──╮
│ 🔹 **Name:** ${config.name}
│ 📝 **Description:** ${description}
│ 📂 **Category:** ${config.category || "Uncategorized"}
│ 🛠 **Role Required:** ${roleDescription}
│ 📖 **Aliases:** ${aliasesText}
│ ⏳ **Cooldown:** ${config.countDown || 1}s
│ ✒ **Author:** ${config.author || "Unknown"}
╰───────────────────╯

📚 **Usage:**
${usage}`;

        await message.reply(response);
      }
    }
  },
};

// Helper function to convert role levels to text
function roleToText(role) {
  switch (role) {
    case 0:
      return "Everyone";
    case 1:
      return "Group Admins";
    case 2:
      return "Bot Admins";
    default:
      return "Unknown";
  }
}
