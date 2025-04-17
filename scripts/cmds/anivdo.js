const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "anivdo",
    aliases: ["ad"],
    version: "2.5",
    author: "Lord Itachi",
    shortDescription: { en: "Send anime video from waifus API" },
    longDescription: { en: "Fetch and send anime video from TikTok CDN" },
    category: "fun",
    guide: { en: "{p}anivdo" }
  },

  onStart: async function ({ api, event }) {
    const videoApi = "https://ani-vid-0kr2.onrender.com/kshitiz";
    const filePath = path.join(__dirname, "anivdo.mp4");

    try {
      // Step 1: Fetch API data
      const res = await axios.get(videoApi);
      const posts = res.data.posts;

      if (!Array.isArray(posts) || !posts.length || !Array.isArray(posts[0])) {
        return api.sendMessage("❌ API returned invalid data format.", event.threadID, event.messageID);
      }

      // Step 2: Use the first video link in the first post
      const videoUrl = posts[0][0];

      if (!videoUrl.startsWith("http")) {
        return api.sendMessage("❌ Invalid video URL.", event.threadID, event.messageID);
      }

      // Step 3: Download the video
      const writer = fs.createWriteStream(filePath);
      const videoRes = await axios({
        method: "GET",
        url: videoUrl,
        responseType: "stream"
      });

      videoRes.data.pipe(writer);

      writer.on("finish", () => {
        api.sendMessage({
          body: `Here's your anime video!`,
          attachment: fs.createReadStream(filePath)
        }, event.threadID, () => {
          fs.unlinkSync(filePath); // cleanup
        }, event.messageID);
      });

    } catch (err) {
      console.error("Download error:", err.message);
      api.sendMessage("❌ Failed to fetch or send the video. " + err.message, event.threadID, event.messageID);
    }
  }
};
