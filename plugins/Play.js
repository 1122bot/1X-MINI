const { cmd } = require('../inconnuboy');
const axios = require('axios'); // Fetch ki jagah axios use kiya hai
const yts = require('yt-search');

cmd({
    pattern: "play2",
    alias: ["ytplay2", "music2"],
    react: "🎶",
    desc: "Download YouTube audio via Movanest API",
    category: "download",
    use: ".play2 <song name>",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("*👑 ENTER SONG NAME OR LINK G!*");

        // React with search
        await m.react("🔍");

        let videoUrl = q;
        let searchResult;

        // Agar link nahi hai to search karein
        if (!q.match(/(youtube\.com|youtu\.be)/)) {
            const search = await yts(q);
            if (!search.videos.length) return reply("*👑 ERROR :❯* NO RESULTS FOUND!");
            searchResult = search.videos[0];
            videoUrl = searchResult.url;
        }

        // API Call using Axios
        const apiUrl = `https://www.movanest.xyz/v2/ytmp3?url=${encodeURIComponent(videoUrl)}`;
        const { data } = await axios.get(apiUrl);

        // Check logic based on your previous API response structure
        if (!data || !data.results || !data.results.download || !data.results.download.url) {
            return reply("*👑 ERROR :❯* API RESPONSE FAILED!");
        }

        const metadata = data.results.metadata;
        const download = data.results.download;

        // Mini Bot Design (Uptime Style Borders)
        let caption = `╭━━━〔 *SONG DOWNLOADER* 〕━━━┈⊷
┃
┃ 👑 *TITLE:* ${metadata.title.toUpperCase()}
┃ 👑 *VIEWS:* ${metadata.views}
┃ 👑 *TIME:* ${metadata.duration.timestamp}
┃ 👑 *SIZE:* ${(download.size / 1024 / 1024).toFixed(2)} MB
┃
╰━━━━━━━━━━━━━━━┈⊷

*POWERED BY BILAL-MD* 👑`;

        // 1. Send Thumbnail with Caption
        await conn.sendMessage(from, { 
            image: { url: metadata.thumbnail || metadata.image }, 
            caption: caption 
        }, { quoted: mek });

        // 2. Send Audio File
        await conn.sendMessage(from, {
            audio: { url: download.url },
            mimetype: 'audio/mpeg',
            fileName: `${metadata.title.toUpperCase()}.mp3`
        }, { quoted: mek });

        await m.react("✅");

    } catch (error) {
        console.error(error);
        reply(`*👑 ERROR :❯* ${error.message.toUpperCase()}`);
    }
});
