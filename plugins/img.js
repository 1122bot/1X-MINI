const { cmd } = require('../inconnuboy');
const axios = require('axios');

cmd({
  pattern: "img",
  alias: ["image", "pic", "photo", "gimage"],
  react: "📸",
  category: "media",
  desc: "Search and send image from Google",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) {
      return reply(
        "*📸 IMAGE SEARCH COMMAND*\n\n" +
        "Is tarah use karo:\n" +
        "*.img <search term>*\n\n" +
        "Example:\n" +
        "*.img cute cats*"
      );
    }

    // 🔗 API call
    const API_URL = `https:///movanest.xyz/v2/googleimage?query=${encodeURIComponent(q)}`;
    const res = await axios.get(API_URL, { timeout: 60000 });

    if (!res.data || !res.data.status || !res.data.results || res.data.results.length === 0) {
      return reply("❌ Koi image nahi mili");
    }

    // ✅ First image URL
    const imageUrl = res.data.results[0];

    await conn.sendMessage(from, {
      image: { url: imageUrl },
      caption: `*📸 Image Result for:* ${q}`
    }, { quoted: mek });

  } catch (err) {
    console.error("IMAGE COMMAND ERROR:", err.message);
    reply("❌ Image search failed / API busy");
  }
});
