const { cmd } = require('../inconnuboy')

cmd({
    pattern: "vv",
    alias: ["viewonce", "view", "open"],
    react: "🥺",
    desc: "Retrieve view-once media (Owner only)",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, isCreator, reply }) => {
    try {
        // 🔒 Owner only
        if (!isCreator) {
            return reply("*YEH COMMAND SIRF BOT OWNER KE LIYE HAI 😎*")
        }

        // 📌 Reply check
        if (!m.quoted) {
            return reply(
                "*🥺 KISI VIEW ONCE PHOTO / VIDEO / AUDIO KO REPLY KARO*\n\n" +
                "*Phir likho:* `.vv`\n\n" +
                "*Phir dekho kamal 😎*"
            )
        }

        const quoted = m.quoted
        const buffer = await quoted.download()
        const type = quoted.mtype

        let content = {}

        // 🖼️ Image
        if (type === "imageMessage") {
            content = {
                image: buffer,
                caption: quoted.text || ""
            }
        }

        // 🎥 Video
        else if (type === "videoMessage") {
            content = {
                video: buffer,
                caption: quoted.text || ""
            }
        }

        // 🎧 Audio
        else if (type === "audioMessage") {
            content = {
                audio: buffer,
                mimetype: "audio/mp4",
                ptt: quoted.ptt || false
            }
        }

        // ❌ Unsupported
        else {
            return reply("*❌ SIRF VIEW ONCE PHOTO / VIDEO / AUDIO SUPPORT HAI 🥺*")
        }

        // 📤 Send recovered media
        await conn.sendMessage(
            from,
            content,
            { quoted: mek }
        )

    } catch (e) {
        console.log("VV ERROR:", e)
        reply("*❌ VIEW ONCE OPEN KARNE ME ERROR AYA 🥺*")
    }
})
