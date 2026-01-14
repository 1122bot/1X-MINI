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

        // 🔥 FlamingText API (JSON)
        const api =
`https://flamingtext.com/net-fu/image_output.cgi?script=neon-logo&text=${text}&_=${Date.now()}`

        reply("*🎨 APKA LOGO BAN RAHA HAI...*")

        // 1️⃣ Get JSON
        const jsonRes = await axios.get(api, {
            headers: { "User-Agent": "Mozilla/5.0" }
        })

        const imageUrl = jsonRes.data?.src
        if (!imageUrl) {
            return reply("*❌ LOGO IMAGE NAHI MILI 🥺*")
        }

        // 2️⃣ Download image as buffer
        const imgRes = await axios.get(imageUrl, {
            responseType: "arraybuffer",
            headers: { "User-Agent": "Mozilla/5.0" }
        })

        const imageBuffer = Buffer.from(imgRes.data)

        // 3️⃣ Send image buffer
        await conn.sendMessage(
            from,
            {
                image: imageBuffer,
                caption: "✅ *LOGO READY 😍*"
            },
            { quoted: mek }
        )

    } catch (e) {
        console.log("LOGO ERROR:", e)
        reply("*❌ LOGO BANANE ME ERROR AYA 🥺*")
    }
})
