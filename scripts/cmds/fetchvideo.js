const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "fetchvideo",
    version: "1.2",
    author: "Lord Denish",
    role: 0,
    category: "videos",
    guide: {
      vi: "Gửi một video ngẫu nhiên từ trang Yourname",
      en: "Send a random video from Yourname site"
    }
  },

  onStart: async function ({ api, event }) {
    const siteURL = "https://ryukazi.github.io/Yourname/";

    try {
      // Fetch and parse the site HTML
      const response = await axios.get(siteURL);
      const $ = cheerio.load(response.data);

      // Collect all video URLs from <source> tags
      const videoSources = [];
      $("video source").each((_, el) => {
        let src = $(el).attr("src");
        if (src) {
          // Make full URL if relative
          if (src.startsWith("/")) {
            src = new URL(src, siteURL).href;
          } else if (!src.startsWith("http")) {
            src = siteURL + src;
          }
          videoSources.push(src);
        }
      });

      // Check if any videos were found
      if (videoSources.length === 0) {
        return api.sendMessage("No videos found on the page.", event.threadID);
      }

      // Pick a random video
      const randomVideo = videoSources[Math.floor(Math.random() * videoSources.length)];
      const videoPath = path.join(__dirname, "tempvideo.mp4");

      const writer = fs.createWriteStream(videoPath);
      const videoStream = await axios({
        url: randomVideo,
        method: "GET",
        responseType: "stream"
      });

      videoStream.data.pipe(writer);

      writer.on("finish", () => {
        api.sendMessage({
          body: "Here's a random video from Yourname site:",
          attachment: fs.createReadStream(videoPath)
        }, event.threadID, () => fs.unlinkSync(videoPath));
      });

      writer.on("error", () => {
        fs.unlinkSync(videoPath);
        api.sendMessage("Failed to download the video.", event.threadID);
      });

    } catch (err) {
      console.error(err);
      api.sendMessage("Error fetching video. Please try again later.", event.threadID);
    }
  }
};
