const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "tiktok",
    aliases: ["tt"],
    author: "Lord Itachi",
    version: "1.2",
    cooldowns: 5,
    role: 0,
    shortDescription: "Get trending TikTok videos.",
    longDescription: "Get trending TikTok videos or search by keyword.",
    category: "fun",
    guide: "{p}tiktok or {p}tiktok {query}",
  },

  onStart: async function ({ api, event, args, message }) {
    const query = args.join(" ");
    const apiUrl = query
      ? `https://tiktrend.vercel.app/tiksearch?search=${encodeURIComponent(query)}`
      : "https://tiktrend.vercel.app/tiktrend";

    try {
      const response = await axios.get(apiUrl);
      const data = query ? response.data.data.videos : response.data.data;

      if (!data || data.length === 0) {
        return message.reply("❌ No videos found.");
      }

      const randomVideo = data[Math.floor(Math.random() * data.length)];

      if (!randomVideo || !randomVideo.play) {
        return message.reply("❌ Unable to retrieve the video. Please try again.");
      }

      const videoUrl = randomVideo.play;
      const duration = randomVideo.duration || "Unknown";
      const shareUrl = randomVideo.share_url || "Not available";

      const tempVideoPath = path.join(__dirname, "cache", `tt_${Date.now()}.mp4`);

      await new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(tempVideoPath);
        writer.on("finish", resolve);
        writer.on("error", reject);
        axios.get(videoUrl, { responseType: "stream" })
          .then(videoResponse => videoResponse.data.pipe(writer))
          .catch(reject);
      });

      const stream = fs.createReadStream(tempVideoPath);

      await message.reply({
        body: ` Here's your Tiktok video ✨\n\n⏱ Duration: ${duration} sec\n🔗 Share URL: ${shareUrl}\n📥 Video URL: ${videoUrl}`,
        attachment: stream
      });

      fs.unlink(tempVideoPath, err => {
        if (err) console.error(`Error deleting temp file: ${err}`);
      });

    } catch (error) {
      console.error("Error fetching TikTok video:", error);
      message.reply("❌ An error occurred. Try using different keywords.");
    }
  }
};
