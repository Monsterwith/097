module.exports = {
  config: {
    name: "birthday",
    version: "1.0",
    author: "Lord Itachi",
    role: 0,
    shortDescription: {
      en: "Wish a user a happy birthday"
    },
    longDescription: {
      en: "Sends a heartfelt birthday wish and mentions the user"
    },
    category: "fun",
    guide: {
      en: "{p}birthday @mention"
    }
  },

  onStart: async function ({ api, event }) {
    const mention = Object.keys(event.mentions)[0];
    const name = event.mentions[mention];

    if (!mention) {
      return api.sendMessage("🎈 Please tag the person you want to wish!", event.threadID);
    }

    const shortWish = `🎉🎂 Happy Birthday, ${name}! 🎂🎉`;
    const longWish = `
Dear ${name} 🥳,

✨ On your special day, I wish you unlimited joy, endless success, and countless sweet memories! 🎁💖

May your heart always be filled with laughter 😂, your path shine with love 💫, and your dreams come true one by one 🌠.

🎂 Enjoy the cake, the company, and every little moment. You deserve the best of everything today and forever!

Cheers to your new age! 🥂  
– With love, 𝗜𝗧𝗔𝗖𝗛𝗜 𝗕𝗢𝗧 👾
`;

    const gif = "https://tinyurl.com/29nn9aot";

    try {
      await api.sendMessage({
        body: shortWish,
        mentions: [{ id: mention, tag: name }]
      }, event.threadID);

      await api.sendMessage({
        body: longWish,
        attachment: await global.utils.getStreamFromURL(gif),
        mentions: [{ id: mention, tag: name }]
      }, event.threadID);
    } catch (err) {
      console.log(err);
      api.sendMessage("❌ Failed to send the birthday messages.", event.threadID);
    }
  }
};
