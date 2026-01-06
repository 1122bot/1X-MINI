const { cmd } = require('../inconnuboy');
const axios = require('axios');

cmd({
  pattern: "song",
  react: "😇",
  alias: ["yta", "ytaudio"],
  category: "download",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply("❌ YouTube link do");

    const apiUrl = `https://www.movanest.xyz/v2/ytmp3?url=${encodeURIComponent(q)}`;
    const res = await axios.get(apiUrl);
    const data = res.data;

    // 🔎 API status check
    if (data.status !== true) {
      return reply("❌ API response false hai");
    }

    if (!data.results || !data.results.download || !data.results.download.url) {
      return reply("❌ Download link missing hai");
    }

    const meta = data.results.metadata;
    const dl = data.results.download;

    const caption = `🎵 *YouTube MP3*
📌 Title: ${meta.title}
👤 Channel: ${meta.author.name}
⏱ Duration: ${meta.duration.timestamp}
🎧 Quality: ${dl.quality}`;

    await conn.sendMessage(
      from,
      {
        audio: { url: dl.url },
        mimetype: "audio/mpeg",
        caption: caption
      },
      { quoted: mek }
    );

  } catch (err) {
    console.log(err);
    reply("❌ Error aa gaya");
  }
});
