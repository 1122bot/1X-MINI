const { cmd } = require('../inconnuboy')
const { fetchGif, gifToSticker } = require('../lib/sticker-utils')

cmd({
    pattern: "attp2",
    react: "✨",
    desc: "Animated text sticker (multi design)",
    category: "sticker",
    use: ".attp <text>",
    filename: __filename
},
async (conn, mek, m, { args, reply }) => {
    try {
        if (!args[0]) {
            return reply("*Use:* `.attp Your Name`")
        }

        const text = encodeURIComponent(args.join(" "))

        // 🎨 MULTIPLE DESIGNS
        const designs = [
            `https://api-fix.onrender.com/api/maker/attp?text=${text}`,
            `https://api-fix.onrender.com/api/maker/attp2?text=${text}`,
            `https://api-fix.onrender.com/api/maker/attp3?text=${text}`,
            `https://api-fix.onrender.com/api/maker/attp4?text=${text}`
        ]

        // 🎲 Random design
        const api = designs[Math.floor(Math.random() * designs.length)]

        reply("✨ *APKA STICKER BAN RAHA HAI...*")

        const gifBuffer = await fetchGif(api)
        const sticker = await gifToSticker(gifBuffer)

        await conn.sendMessage(m.chat, { sticker }, { quoted: mek })

    } catch (e) {
        console.log("ATTP ERROR:", e)
        reply("*❌ STICKER BANANE ME ERROR AYA 🥺*")
    }
})
