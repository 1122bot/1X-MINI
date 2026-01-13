const { cmd } = require('../inconnuboy')
const googleTTS = require('google-tts-api')
const axios = require('axios')

cmd({
    pattern: "tts",
    react: "☺️",
    desc: "Convert text to voice",
    category: "fun",
    use: ".tts <text>",
    filename: __filename
},
async (conn, mek, m, { from, q, args, reply }) => {
    try {
        if (!q) {
            return reply(
                "*🗣️ AP NE TEXT KI VOICE BANANI HAI 🥺*\n\n" +
                "*Use:*\n.tts Hello how are you\n\n" +
                "*Urdu ke liye:*\n.tts ur السلام علیکم"
            )
        }

        // 🌍 Language select
        let lang = "en"
        if (args[0] === "ur" || args[0] === "urdu") {
            lang = "ur"
            q = args.slice(1).join(" ")
        }

        // 🎙️ Google TTS audio URL
        const audioUrl = googleTTS.getAudioUrl(q, {
            lang,
            slow: false,
            host: "https://translate.google.com"
        })

        // ⬇️ Download audio
        const res = await axios.get(audioUrl, { responseType: "arraybuffer" })
        const audioBuffer = Buffer.from(res.data)

        // 📤 Send voice (normal audio)
        await conn.sendMessage(
            from,
            {
                audio: audioBuffer,
                mimetype: "audio/mp4",
                fileName: "tts.mp3",
                ptt: false
            },
            { quoted: mek }
        )

    } catch (e) {
        console.log("TTS ERROR:", e)
        reply("*❌ VOICE BANANE ME ERROR AYA 🥺*")
    }
})
