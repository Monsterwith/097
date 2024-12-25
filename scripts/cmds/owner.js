const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "owner",
    aliases: ["itachi", "creator"],
    version: "1.0",
    author: "Itachiffx",
    role: 0,
    shortDescription: { en: "Displays information about the bot's creator 🤫🗿🚬." },
    longDescription: { en: "Provides details about the bot's creator, including name, Facebook link, photo, and video. 🫵🏻😂💗" },
    category: "owner",
    guide: { en: "Use {p}admin to reveal the creator's details. 🤫🗿" },
    creatorDetails: {
      name: "Itachi",
      fbLink: "https://www.facebook.com/itachisenseihere?mibextid=ZbWKwL",
      photoLink: "https://i.ibb.co/7pSMgCP/image.jpg", // Replace with a valid photo URL
      videoLink: "https://drive.google.com/file/d/1U7deUFePEXysFqPCr5Vy_YAVRWAG5sfu/view?usp=drivesdk" // Replace with a valid video URL
    }
  },
  onStart: async function ({ api, event }) {
    try {
      const { creatorDetails } = this.config;

      // Fetch the creator's photo
      const photoResponse = await axios.get(creatorDetails.photoLink, { responseType: "arraybuffer" });
      const photoPath = path.join(__dirname, "cache", `creator_photo.jpg`);
      await fs.outputFile(photoPath, photoResponse.data);

      // Prepare message
      const message = `Meet the Creator! 🫵🏻💗\n\nName: ${creatorDetails.name} 🗿\nFacebook: ${creatorDetails.fbLink} 🚬`;

      // Send photo with message
      await api.sendMessage(
        {
          body: message,
          attachment: fs.createReadStream(photoPath),
        },
        event.threadID,
        async () => {
          // Optionally, send a video after the photo
          const videoResponse = await axios.get(creatorDetails.videoLink, { responseType: "arraybuffer" });
          const videoPath = path.join(__dirname, "cache", `creator_video.mp4`);
          await fs.outputFile(videoPath, videoResponse.data);

          await api.sendMessage(
            {
              body: "Here's a short video of the creator! 😂💗",
              attachment: fs.createReadStream(videoPath),
            },
            event.threadID
          );

          // Clean up cache
          await fs.unlink(photoPath);
          await fs.unlink(videoPath);
        }
      );
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error in Admin Command:`, error);
      await api.sendMessage("An error occurred while fetching the creator's details. 🤫", event.threadID);
    }
  },
};
