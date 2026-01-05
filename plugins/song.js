const { cmd } = require('../inconnuboy')
const fetch = require('node-fetch')
const yts = require('yt-search')

cmd({
  pattern: "song",
  alias: ["play", "mp3"],
  react: "🎶",
  desc: "Download YouTube song (Audio) via Nekolabs API",
  category: "download",
  use: ".song <query>",
  filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
  try {
    if (!q) return reply("*AP NE KOI AUDIO DOWNLOADING KARNI HAI 🤔*\n*TO AP ESE LIKHO ☺️*\n\n*SONG ❮AUDIO NAME❯* \n\n*JAB AP ESE LIKHO GE 🙂 TO APKA AUDIO DOWNLOADING KAR KE 😍 YAHA PER BHEJ DYA JAYE GA 😊❣️*");

    // 🔹 Call Nekolabs API (directly supports search query or URL)
    const apiUrl = `https://api.nekolabs.my.id/downloader/youtube/play/v1?q=${encodeURIComponent(q)}`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (!data?.status || !data?.result?.downloadUrl) {
      return reply("*SIRF YOUTUBE VIDEO/AUDIO KA LINK DO YA AUDIO KA NAME LIKHO 😊*");
    }

    const meta = data.result.metadata;
    const dlUrl = data.result.downloadUrl;

    // 🔹 Thumbnail buffer
    let buffer;
    try {
      const thumbRes = await fetch(meta.cover);
      buffer = Buffer.from(await thumbRes.arrayBuffer());
    } catch {
      buffer = null;
    }

    // 🔹 Caption card with extra info
    const caption = `
*👑 AUDIO INFO 👑*

*👑 NAME :❯ ${meta.title}*
*👑 CHANNEL :❯ ${meta.channel}*
*👑 TIME :❯* ${meta.duration}
*👑 AUDIO LINK 👑*
*(${meta.url})*

*👑 BILAL-MD 👑
`;

    // 🔹 Send info card
    await conn.sendMessage(from, {
      image: buffer,
      caption
    }, { quoted: mek });

    // 🔹 Send audio file
    await conn.sendMessage(from, {
      audio: { url: dlUrl },
      mimetype: "audio/mpeg",
      fileName: `${meta.title.replace(/[\\/:*?"<>|]/g, "").slice(0, 80)}.mp3`
    }, { quoted: mek });

  } catch (err) {
    console.error("song cmd error:", err);
    reply("⚠️ An error occurred while processing your request.");
  }
});
