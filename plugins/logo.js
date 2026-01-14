const { cmd } = require('../inconnuboy')
const axios = require('axios')

cmd({
    pattern: "logo",
    alias: ["makelogo", "namelogo"],
    react: "🎨",
    desc: "Create stylish name logo",
    category: "logo",
    use: ".logo <name>",
    filename: __filename
},
async (conn, mek, m, { from, args, reply }) => {
    try {
        if (!args[0]) {
            return reply(
                "*🎨 NAME KA LOGO BANANE KE LIYE 🥺*\n\n" +
                "*Use:*\n.logo Bilal\n.logo Umar Jazz"
            )
        }

        const text = encodeURIComponent(args.join(" "))

        // 🎨 DIFFERENT LOGO STYLES (random)
        const logos = [
            `https://api-fix.onrender.com/api/logo/neon?text=${text}`,
            `https://api-fix.onrender.com/api/logo/glow?text=${text}`,
            `https://api-fix.onrender.com/api/logo/fire?text=${text}`,
            `https://api-fix.onrender.com/api/logo/3d?text=${text}`,
            `https://api-fix.onrender.com/api/logo/gold?text=${text}`
        ]

        const api = logos[Math.floor(Math.random() * logos.length)]

        reply("*🎨 APKA LOGO BAN RAHA HAI...*")

        const res = await axios.get(api, { responseType: "arraybuffer" })
        const buffer = Buffer.from(res.data)

        await conn.sendMessage(
            from,
            { image: buffer, caption: "*✅ LOGO READY 😍*" },
            { quoted: mek }
        )

    } catch (e) {
        console.log("LOGO ERROR:", e)
        reply("*❌ LOGO BANANE ME ERROR AYA 🥺*")
    }
})
