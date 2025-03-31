module.exports = {
  config: {
    name: "spy",
    version: "1.1",
    author: "Itachiffx",
    countDown: 5,
    role: 0,
    shortDescription: "Get user information and avatar",
    longDescription: "Get user information and avatar by mentioning",
    category: "image",
  },

  onStart: async function ({ event, message, usersData, api, args, getLang }) {
    let uid;
    const uid1 = event.senderID;
    const uid2 = Object.keys(event.mentions)[0];

    if (args[0]) {
      if (/^\d+$/.test(args[0])) {
        uid = args[0];
      } else {
        const match = args[0].match(/profile\.php\?id=(\d+)/);
        if (match) uid = match[1];
      }
    }

    if (!uid) {
      uid = event.type === "message_reply" ? event.messageReply.senderID : uid2 || uid1;
    }

    api.getUserInfo(uid, async (err, userInfo) => {
      if (err) return message.reply("Failed to retrieve user information.");

      const avatarUrl = await usersData.getAvatarUrl(uid);

      // Gender mapping
      let genderText = "🚻 Unknown";
      if (userInfo[uid].gender === 1) genderText = "👩 Girl";
      if (userInfo[uid].gender === 2) genderText = "👨 Boy";

      // Friend status
      const isFriend = userInfo[uid].isFriend ? "Yes ✅" : "No ❎";

      // Money & Rank (Replace with real values)
      const money = await usersData.get(uid, "money") || 0;
      const rank = "#103/525";  // Placeholder: Replace with actual rank logic
      const moneyRank = "#525/525";  // Placeholder: Replace with actual money rank logic

      // Fetch user details
      const username = userInfo[uid].vanity || "None";
      const nickname = userInfo[uid].alternateName || "None";
      const birthday = userInfo[uid].isBirthday ? "Today 🎂" : "Private";

      // Group Name (Replace with actual logic if available)
      const groupName = "BOT VERSE";  

      // Constructing the user info message
      const userInformation = `╭───╴✨【 𝐔𝐒𝐄𝐑 𝐈𝐍𝐅𝐎 】✨
├💼 𝐍𝐚𝐦𝐞: ${userInfo[uid].name}
├👤 𝐍𝐢𝐜𝐤𝐧𝐚𝐦𝐞: ${nickname}
├🌍 𝐆𝐫𝐨𝐮𝐩: ${groupName}
├🧬 𝐆𝐞𝐧𝐝𝐞𝐫: ${genderText}
├🆔 𝐔𝐈𝐃: ${uid}
├🏷 𝐂𝐥𝐚𝐬𝐬: user
├🌐 𝐔𝐬𝐞𝐫𝐧𝐚𝐦𝐞: ${username}
├🔗 𝐏𝐫𝐨𝐟𝐢𝐥𝐞 𝐔𝐑𝐋: https://www.facebook.com/profile.php?id=${uid}
├🎂 𝐁𝐢𝐫𝐭𝐡𝐝𝐚𝐲: ${birthday}
╰🤝 𝐅𝐫𝐢𝐞𝐧𝐝 𝐰𝐢𝐭𝐡 𝐁𝐨𝐭: ${isFriend}

╭───╴🌟【 𝐔𝐒𝐄𝐑 𝐒𝐓𝐀𝐓𝐒 】🌟
├💰 𝐌𝐨𝐧𝐞𝐲: $${money}
├📈 𝐑𝐚𝐧𝐤: ${rank}
╰💵 𝐌𝐨𝐧𝐞𝐲 𝐑𝐚𝐧𝐤: ${moneyRank}`;

      // Send the user info with avatar
      message.reply({
        body: userInformation,
        attachment: await global.utils.getStreamFromURL(avatarUrl)
      });
    });
  }
};
