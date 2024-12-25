const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "memevoice",
    aliases: ["mv"],
    version: "1.0",
    author: "Kshitiz",
    countDown: 10,
    role: 0,
    shortDescription: "Sends a random meme voice",
    longDescription: "Sends a random meme voice",
    category: "fun",
    guide: "{pn} memevoice",
  },
  onStart: async function ({ api, event, message }) {
    api.setMessageReaction("⏰", event.messageID, () => {}, true);
    const cacheDir = path.join(__dirname, "cache");
    try {
      const { data } = await axios.get("https://mvoice-rmis.onrender.com/kshitiz", {
        responseType: "arraybuffer",
      });
      await fs.promises.mkdir(cacheDir, { recursive: true }); // Ensure the cache directory exists
      const filePath = path.join(cacheDir, `${Date.now()}.mp3`);
      fs.writeFileSync(filePath, Buffer.from(data));

      await message.reply({
        body: "🔊 Here's your meme voice:",
        attachment: fs.createReadStream(filePath),
      });

      console.log("Audio sent successfully.");

      // Clean up the temporary file
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error("Error occurred:", error);
      message.reply(`An error occurred: ${error.message}`);
    }
  },
};
