const { cmd } = require('../inconnuboy');
const axios = require('axios');

cmd({
  pattern: "aimg",
  alias: ["aiimage", "genimg", "pollinations"],
  react: "🖼️",
  category: "ai",
  desc: "Generate AI image using Pollinations API",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) {
      return reply(
        "*🖼️ AI IMAGE GENERATOR*\n\n" +
        "Use is tarah:\n" +
        "*.aimg <prompt>*\n\n" +
        "Example:\n" +
        "*.aimg a cute cat sitting on a sofa*"
      );
    }

    // ✅ API call
    const apiUrl = `https://www.movanest.xyz/v2/pollinations-image?prompt=${encodeURIComponent(q)}&model=flux&width=512&height=512`;
    const res = await axios.get(apiUrl, { timeout: 60000 });

    if (!res.data || !res.data.status || !res.data.image) {
      return reply("❌ Image generate nahi hui / API busy");
    }

    const imageUrl = res.data.image;

    // ✅ Send image
    await conn.sendMessage(from, {
      image: { url: imageUrl },
      caption: `🖼️ AI Image for prompt: "${q}"`
    }, { quoted: mek });

  } catch (err) {
    console.error("AI IMAGE COMMAND ERROR:", err.message);
    reply("❌ Error generating AI image / API busy");
  }
});
