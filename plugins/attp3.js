const { cmd } = require('../inconnuboy')
const { fetchGif, gifToSticker } = require('../lib/sticker-utils')

cmd({
    pattern: "attp3",
    alias: ["atp", "att"],
    react: "✨",
    desc: "Animated text sticker (random designs)",
    category: "sticker",
    use: ".attp <text>",
    filename: __filename
},
async (conn, mek, m, { args, reply }) => {
    try {
        if (!args[0]) {
            return reply(
                "*✨ NAME STICKER BANANE KE LIYE*\n\n" +
                "*Use:*\n.attp Bilal\n.attp Umar Khan"
            )
        }

        const text = encodeURIComponent(args.join(" "))

        // 🎨 MULTIPLE DESIGNS (random)
        const designs = [
            `https://api-fix.onrender.com/api/maker/attp?text=${text}`,
            `https://api-fix.onrender.com/api/maker/attp2?text=${text}`,
            `https://api-fix.onrender.com/api/maker/attp3?text=${text}`,
            `https://api-fix.onrender.com/api/maker/attp4?text=${text}`
        ]

        const api = designs[Math.floor(Math.random() * designs.length)]

        reply("*✨ APKA STICKER BAN RAHA HAI...*")

        const gif = await fetchGif(api)
        const sticker = await gifToSticker(gif)

        await conn.sendMessage(
            m.chat,
            { sticker },
            { quoted: mek }
        )

    } catch (e) {
        console.log("ATTP ERROR:", e)
        reply("*❌ STICKER BANANE ME ERROR AYA 🥺*")
    }
})
