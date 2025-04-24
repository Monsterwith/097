module.exports = {
  config: {
    name: "portfolio",
    version: "1.4",
    author: "Lord Itachi",
    role: 0,
    shortDescription: {
      en: "Show your developer portfolio"
    },
    longDescription: {
      en: "Sends a stylish animated portfolio link with profile and social links"
    },
    category: "info",
    guide: {
      en: "{p}portfolio"
    }
  },

  onStart: async function ({ api, event }) {
    const msg = `
✨ 𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝘁𝗼 𝗺𝘆 𝗗𝗶𝗴𝗶𝘁𝗮𝗹 𝗣𝗼𝗿𝘁𝗳𝗼𝗹𝗶𝗼! ✨

👤 *Name: 𝗜𝘁𝗮𝗰𝗵𝗶 𝗨𝗰𝗵𝗶𝗵𝗮  
💻 Role: 𝗙𝘂𝗹𝗹-𝗦𝘁𝗮𝗰𝗸 𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗿  
🌐 Skills: Coding • Design • Automation • UI Magic

🔗 Portfolio:  
https://protfolio-3.vercel.app/

🔹 Facebook:  
https://www.facebook.com/ITACHIFUCXX

🔹 GitHub:  
https://github.com/Itachi-jod

🔹 Instagram:  
https://www.instagram.com/yours_ashib?igsh=MW9vZGYwb3lnOTZvMg==

🧠 Dive into my projects and tech world. Let me know what you think!

— Powered by code, creativity & coffee ☕
`;

    const imgURL = "https://i.ibb.co/rhGP7Nx/image.jpg";

    try {
      await api.sendMessage({
        body: msg,
        attachment: await global.utils.getStreamFromURL(imgURL)
      }, event.threadID);
    } catch (err) {
      console.error(err);
      api.sendMessage("❌ | Failed to send the portfolio.", event.threadID);
    }
  }
};
