const fs = require("fs-extra");
const { utils } = global;

module.exports = {
  config: {
    name: "prefix",
    version: "2.0",
    author: "Kshitiz",
    countDown: 5,
    role: 0,
    description: "Customize the bot's prefix locally or globally (admin only)",
    category: "config",
    guide: {
      en: "{pn} <new prefix>: Change the prefix in your chat group\n" +
        "Example: {pn} #\n\n" +
        "{pn} <new prefix> -g: Change prefix globally (admin only)\n" +
        "Example: {pn} # -g\n\n" +
        "{pn} reset: Reset the prefix in your chat group to default"
    }
  },

  langs: {
    en: {
      reset: "🔄 Your prefix has been reset to the default: %1",
      onlyAdmin: "⛔ Only admins can change the global prefix.",
      confirmGlobal: "✅ React to confirm global prefix change.",
      confirmLocal: "✅ React to confirm prefix change for this chat.",
      successGlobal: "🌐 Global prefix updated to: %1",
      successLocal: "🛸 Prefix updated for this chat to: %1",
      prefixInfo: "🌐 System prefix: %1\n🛸 Chat prefix: %2"
    }
  },

  onStart: async function ({ message, role, args, event, threadsData, getLang }) {
    const threadID = event.threadID;

    if (!args[0]) return message.SyntaxError();

    if (args[0].toLowerCase() === "reset") {
      await threadsData.set(threadID, null, "data.prefix");
      return message.reply(getLang("reset", global.GoatBot.config.prefix));
    }

    const newPrefix = args[0];
    const isGlobal = args[1] === "-g";

    if (isGlobal && role < 2) {
      return message.reply(getLang("onlyAdmin"));
    }

    const confirmationMessage = isGlobal ? getLang("confirmGlobal") : getLang("confirmLocal");
    const formSet = {
      commandName: this.config.name,
      author: event.senderID,
      newPrefix,
      isGlobal
    };

    return message.reply(confirmationMessage, (err, info) => {
      if (err) return console.error(err);
      formSet.messageID = info.messageID;
      global.GoatBot.onReaction.set(info.messageID, formSet);
    });
  },

  onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
    const { author, newPrefix, isGlobal } = Reaction;

    if (event.userID !== author) return;

    if (isGlobal) {
      global.GoatBot.config.prefix = newPrefix;
      fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
      return message.reply(getLang("successGlobal", newPrefix));
    } else {
      await threadsData.set(event.threadID, newPrefix, "data.prefix");
      return message.reply(getLang("successLocal", newPrefix));
    }
  },

  onChat: async function ({ event, message, threadsData, getLang }) {
    const threadID = event.threadID;
    const systemPrefix = global.GoatBot.config.prefix;
    const threadPrefix = await threadsData.get(threadID, "data.prefix") || systemPrefix;

    if (event.body && event.body.toLowerCase() === "prefix") {
      const imageUrl = "https://i.ibb.co/sHHMNq1/image.gif";
      const prefixInfo = getLang("prefixInfo", systemPrefix, threadPrefix);

      return message.reply({
        body: `┏𝗣𝗥𝗘𝗙𝗜𝗫\n┗━━━⦿【${threadPrefix}】`,
        attachment: await utils.getStreamFromURL(imageUrl)
      });
    }
  }
};
