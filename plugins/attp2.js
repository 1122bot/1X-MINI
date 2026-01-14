const { cmd } = require('../inconnuboy')
const { fetchGif, gifToSticker } = require('../lib/sticker-utils')

cmd({
    pattern: "attp234",
    react: "✨",
    desc: "Animated text sticker (multi design)",
    category: "sticker",
    use: ".attp <text> | .attp <style> <text>",
    filename: __filename
},
async (conn, mek, m, { args, reply }) => {
    try {
        if (!args[0]) {
            return reply(
`✨ *ATTP STICKER*

Use:
.attp Bilal
.attp 2 Bilal

Styles:
1 = Classic
2 = Red Glow
3 = Blue Glow
4 = Neon`
            )
        }

        // 🎨 Available designs
        const designs = {
            1: 'https://api-fix.onrender.com/api/maker/attp',
            2: 'https://api-fix.onrender.com/api/maker/attp2',
            3: 'https://api-fix.onrender.com/api/maker/attp3',
            4: 'https://api-fix.onrender.com/api/maker/attp4'
        }

        let style = 0
        let text = ""

        // agar pehla arg number hai
        if (/^[1-4]$/.test(args[0])) {
            style = args[0]
            text = args.slice(1).join(" ")
        } else {
            // random style
            style = Object.keys(designs)[
                Math.floor(Math.random() * Object.keys(designs).length)
            ]
            text = args.join(" ")
        }

        if (!text) return reply("*❌ TEXT missing hai*")

        const api = `${designs[style]}?text=${encodeURIComponent(text)}`

        reply("✨ *APKA STICKER BAN RAHA HAI...*")

        const gifBuffer = await fetchGif(api)
        const sticker = await gifToSticker(gifBuffer)

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
