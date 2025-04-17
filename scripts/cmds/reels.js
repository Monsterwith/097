const axios = require("axios");
const fs = require("fs");
const path = require("path");
const os = require("os");

async function downloadVideo(url, destination) {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  fs.writeFileSync(destination, Buffer.from(response.data, "binary"));
}

module.exports = {
  config: {
    name: "reels",
    aliases: ["instareel", "animereel"],
    author: "Lord Itachi",
    version: "2.1",
    shortDescription: {
      en: "Auto-send a random Instagram reel from anime hashtags",
    },
    longDescription: {
      en: "Fetches and sends a random reel from hashtags like #animedits, #lyricalvideo, or #quotesanime",
    },
    category: "fun",
    guide: {
      en: "{p}autoreels",
    },
  },

  onStart: async function ({ api, event }) {
    const hashtags = ["animedits", "lyricalvideo", "quotesanime", "Instagram", "fyp", "luffy_vibes", "anime"];
    const selectedHashtag = hashtags[Math.floor(Math.random() * hashtags.length)];

    try {
      const response = await axios.get(`https://reels-insta.vercel.app/reels?hashtag=${selectedHashtag}`);
      const videoURLs = response.data.videoURLs;

      if (!videoURLs || videoURLs.length === 0) {
        return api.sendMessage(`No reels found for #${selectedHashtag}.`, event.threadID, event.messageID);
      }

      const randomIndex = Math.floor(Math.random() * videoURLs.length);
      const selectedVideoURL = videoURLs[randomIndex];

      const tempVideoPath = path.join(os.tmpdir(), `reel_${Date.now()}.mp4`);
      await downloadVideo(selectedVideoURL, tempVideoPath);

      await api.sendMessage({
        body: `Here's a Random Reel 🤍🫶🏻`,
        attachment: fs.createReadStream(tempVideoPath),
      }, event.threadID, event.messageID);

      fs.unlinkSync(tempVideoPath);
    } catch (error) {
      console.error(error);
      api.sendMessage("Failed to fetch or send reel. Please try again later.", event.threadID, event.messageID);
    }
  }
};
