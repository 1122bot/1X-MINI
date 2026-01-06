const { cmd } = require('../inconnuboy');
const axios = require('axios'); // Fetch ki jagah axios zyada stable hai

cmd({
  pattern: "song",
  alias: ["play", "mp3"],
  react: "🎶",
  desc: "Download YouTube song (Audio)",
  category: "download",
  use: ".song <query>",
  filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
  try {
    // Basic Input Check
    if (!q) return reply("*AP NE KOI AUDIO DOWNLOADING KARNI HAI 🤔*\n*TO AP ESE LIKHO ☺️*\n\n*SONG ❮AUDIO NAME❯*");

    // Start Reaction
    await m.react("📥");

    // Calling API
    const apiUrl = `https://api.nekolabs.my.id/downloader/youtube/play/v1?q=${encodeURIComponent(q)}`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    // Check if result is valid
    if (!data || !data.result || !data.result.downloadUrl) {
      await m.react("❌");
      return reply("*SORRY G, MUJHE YE SONG NAHI MILA! 😔*");
    }

    const { metadata, downloadUrl } = data.result;

    // Design Caption with UpperCase
    let caption = `╭━━━〔 *SONG DOWNLOADER* 〕━━━┈⊷
┃
┃ 👑 *NAME:* ${metadata.title.toUpperCase()}
┃ 👑 *CHANNEL:* ${metadata.channel.toUpperCase()}
┃ 👑 *DURATION:* ${metadata.duration}
┃ 👑 *VIEWS:* ${metadata.views || 'N/A'}
┃
╰━━━━━━━━━━━━━━━┈⊷

*POWERED BY BILAL-MD* 👑`;

    // 1. Send Thumbnail with Caption
    await conn.sendMessage(from, {
      image: { url: metadata.cover },
      caption: caption
    }, { quoted: mek });

    // 2. Send Audio File
    await conn.sendMessage(from, {
      audio: { url: downloadUrl },
      mimetype: "audio/mpeg",
      fileName: `${metadata.title}.mp3`
    }, { quoted: mek });

    // Success Reaction
    await m.react("✅");

  } catch (err) {
    console.error("SONG CMD ERROR:", err);
    await m.react("❌");
    reply(`*❌ ERROR:* API KI TARAF SE MASLA HAI YA BOT CRASH HUA HAI.`);
  }
});
