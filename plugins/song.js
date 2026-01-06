const { cmd } = require('../inconnuboy');
const axios = require('axios');

cmd({
  pattern: "song",
  react: "😇",
  category: "download",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply("❌ Song name ya YouTube link do");

    let ytUrl = q;

    // 🔍 Agar link nahi hai → search karo
    if (!q.startsWith("http")) {
      const searchApi = `https://www.movanest.xyz/v2/ytsearch?query=${encodeURIComponent(q)}`;
      const searchRes = await axios.get(searchApi);
      const searchData = searchRes.data;

      if (!searchData.status || !searchData.results || searchData.results.length === 0) {
        return reply("❌ Song nahi mila");
      }

      ytUrl = searchData.results[0].url; // first result
    }

    // 🎵 MP3 API
    const apiUrl = `https://www.movanest.xyz/v2/ytmp3?url=${encodeURIComponent(ytUrl)}`;
    const { data } = await axios.get(apiUrl);

    if (data.status !== true || !data.results) {
      return reply("❌ Audio fetch nahi hui");
    }

    const meta = data.results.metadata;
    const dl = data.results.download;

    if (!dl?.url) return reply("❌ Audio link missing");

    // ℹ️ Simple info
    await reply(
      `🎵 *Song Info*\n\n` +
      `📌 ${meta.title}\n` +
      `👤 ${meta.author.name}\n` +
      `⏱ ${meta.duration.timestamp}`
    );

    // 🔊 Direct audio
    await conn.sendMessage(
      from,
      {
        audio: { url: dl.url },
        mimetype: "audio/mpeg"
      },
      { quoted: mek }
    );

  } catch (err) {
    console.log("SONG CMD ERROR:", err);
    reply("❌ Error aa gaya");
  }
});
