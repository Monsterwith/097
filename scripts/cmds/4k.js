const axios = require("axios");

module.exports = {
  config: {
    name: "4k",
    aliases: ["upscale"],
    version: "1.2",
    role: 0,
    author: "Fahim_Noob",
    countDown: 5,
    longDescription: "Upscale images to 4K resolution.",
    category: "image",
    guide: {
      en: "{pn} - Reply to an image to upscale it to 4K resolution."
    }
  },
  onStart: async function ({ message, event }) {
    // Check if the user replied to a message with an image
    if (
      !event.messageReply ||
      !event.messageReply.attachments ||
      !event.messageReply.attachments[0] ||
      event.messageReply.attachments[0].type !== "photo"
    ) {
      return message.reply("❌| Please reply to an image to upscale it.");
    }

    const imgUrl = encodeURIComponent(event.messageReply.attachments[0].url);
    const apiUrl = `https://smfahim.xyz/4k?url=${imgUrl}`;

    // Notify user that processing has started
    const processingMsg = await message.reply("🔄| Processing... Please wait a moment.");

    try {
      // Request upscale from the API
      const response = await axios.get(apiUrl);

      if (!response.data || !response.data.image) {
        throw new Error("Invalid API response.");
      }

      const imageStream = await global.utils.getStreamFromURL(response.data.image, "upscaled-image.png");

      // Send the upscaled image to the user
      await message.reply({
        body: "✅| Here is your 4K upscaled image:",
        attachment: imageStream,
      });

      // Remove the processing message
      if (processingMsg.messageID) {
        await message.unsend(processingMsg.messageID);
      }
    } catch (error) {
      console.error("Error during image upscaling:", error);
      message.reply("❌| Failed to upscale your image. Please try again later.");
    }
  },
};
