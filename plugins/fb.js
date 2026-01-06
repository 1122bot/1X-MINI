const { cmd } = require('../inconnuboy');
const axios = require('axios');

cmd({
  pattern: "fb",
  alias: ["facebook", "fbdl"],
  react: "☺️",
  desc: "Download Facebook Videos",
  category: "download",
  use: ".fb <url>",
  filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
  try {
    if (!q) return reply("*👑 ENTER FACEBOOK VIDEO LINK G g!*");

    // Start Reaction
    await m.react("😃");

    // FIXED API ENDPOINT: fbdown ko badal kar fbdl kar diya gaya hai
    const apiUrl = `https://www.movanest.xyz/v2/fbdl?url=${encodeURIComponent(q)}`; 
    const { data } = await axios.get(apiUrl);

    // Validation check for results array
    if (!data || !data.status || !data.results || !data.results.length) {
      await m.react("😢");
      return reply("*👑 ERROR :❯* VIDEO NOT FOUND OR PRIVATE! 😔");
    }

    const video = data.results[0];
    // HD link ko priority, warna normal
    const dlUrl = video.hdQualityLink || video.normalQualityLink;

    // Design Caption (Uptime style borders)
    let caption = `╭━━━〔 *FB DOWNLOADER* 〕━━━┈⊷
┃
┃ 👑 *TITLE:* ${video.title ? video.title.toUpperCase() : "FB VIDEO"}
┃ 👑 *DUR:* ${video.duration ? video.duration.toUpperCase() : "N/A"}
┃ 👑 *QUALITY:* ${video.hdQualityLink ? 'HD (720P)' : 'NORMAL (360P)'}
┃
╰━━━━━━━━━━━━━━━┈⊷

*POWERED BY BILAL-MD* 👑`;

    // 1. Send Image/Thumbnail with Caption
    await conn.sendMessage(from, { 
      image: { url: video.thumbnail }, 
      caption: caption 
    }, { quoted: mek });

    // 2. Send Actual Video File
    await conn.sendMessage(from, {
      video: { url: dlUrl },
      caption: "*👑 BY :❯ BILAL-MD 👑*",
      mimetype: "video/mp4",
      fileName: `fb_video.mp4`
    }, { quoted: mek });

    await m.react("✅");

  } catch (err) {
    console.error("FB CMD ERROR:", err);
    await m.react("❌");
    reply("*👑 ERROR :❯* API SE RABTA NAHI HO PA RHA! 😔");
  }
});
