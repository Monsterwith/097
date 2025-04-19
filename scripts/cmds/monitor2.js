const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "monitor2",
    version: "2.0",
    author: "Lord Itachi",
    countDown: 3,
    role: 0,
    description: {
      en: "Advanced group activity monitor"
    },
    category: "group",
    guide: {
      en: "{pn} - Show full group activity report"
    }
  },

  onStart: async function ({ message, event, threadsData, usersData }) {
    const threadID = event.threadID;
    const today = moment().format("DD/MM/YYYY");

    // Get or initialize group stats
    let threadData = await threadsData.get(threadID);
    if (!threadData.data.activity) threadData.data.activity = {};
    const stats = threadData.data.activity;

    // Reset daily if outdated
    if (stats.lastUpdated !== today) {
      stats.lastUpdated = today;
      stats.today = {};
    }

    const todayStats = stats.today || {};
    const allTimeStats = stats.allTime || {};
    const lastMessageTime = stats.lastMessage || "No data";

    const totalToday = Object.values(todayStats).reduce((a, b) => a + b, 0);
    const totalAllTime = Object.values(allTimeStats).reduce((a, b) => a + b, 0);

    const avgToday = totalToday > 0 ? (totalToday / Object.keys(todayStats).length).toFixed(2) : 0;
    const avgAll = totalAllTime > 0 ? (totalAllTime / Object.keys(allTimeStats).length).toFixed(2) : 0;

    const formatTop = async (statObj, top = 3) => {
      const sorted = Object.entries(statObj).sort((a, b) => b[1] - a[1]).slice(0, top);
      const lines = await Promise.all(sorted.map(async ([uid, count], i) => {
        const name = await usersData.getName(uid) || "Unknown";
        return `${i + 1}. ${name} (${count})`;
      }));
      return lines.join("\n") || "No activity";
    };

    const topToday = await formatTop(todayStats);
    const topAll = await formatTop(allTimeStats);

    const report = `📊 Group Activity Report:
━━━━━━━━━━━━━━━
🗓 Date: ${today}
🕒 Last Message: ${lastMessageTime}
━━━━━━━━━━━━━━━
✉️ Messages Today: ${totalToday}
⭐ Average/User Today: ${avgToday}
🏆 Top 3 Today:
${topToday}
━━━━━━━━━━━━━━━
🌐 Messages All Time: ${totalAllTime}
📊 Average/User All-Time: ${avgAll}
👑 Top 3 All-Time:
${topAll}
━━━━━━━━━━━━━━━`;

    message.reply(report);
    await threadsData.set(threadID, { data: threadData.data });
  },

  onChat: async function ({ event, threadsData }) {
    const threadID = event.threadID;
    const senderID = event.senderID;
    const now = moment().tz("Asia/Ho_Chi_Minh");
    const today = now.format("DD/MM/YYYY");

    // Get or initialize stats
    let threadData = await threadsData.get(threadID);
    if (!threadData.data.activity) threadData.data.activity = {};

    const stats = threadData.data.activity;

    // Reset daily if outdated
    if (stats.lastUpdated !== today) {
      stats.lastUpdated = today;
      stats.today = {};
    }

    if (!stats.today[senderID]) stats.today[senderID] = 0;
    if (!stats.allTime) stats.allTime = {};
    if (!stats.allTime[senderID]) stats.allTime[senderID] = 0;

    stats.today[senderID]++;
    stats.allTime[senderID]++;
    stats.lastMessage = now.format("HH:mm:ss");

    await threadsData.set(threadID, { data: threadData.data });
  }
};
