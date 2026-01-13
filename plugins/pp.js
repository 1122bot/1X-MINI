const { cmd } = require('../inconnuboy')
const fs = require('fs')
const path = require('path')
const { downloadContentFromMessage } = require('@whiskeysockets/baileys')

cmd({
    pattern: "pp",
    alias: ["setbotpp", "setprofile", "ppbot"],
    react: "😇",
    desc: "Change bot profile picture (Owner only)",
    category: "owner",
    use: ".setpp (reply to image)",
    filename: __filename
},
async (conn, mek, m, { from, isCreator, reply }) => {
    try {
        if (!isCreator)
            return reply("*YEH COMMAND SIRF BOT OWNER KE LIYE HAI 😎*")

        const quoted = m.quoted ? m.quoted : m
        const mime = (quoted.msg || quoted).mimetype || ""

        if (!mime.startsWith("image/")) {
            return reply(
                "*KISI PHOTO KO REPLY KARO 🥺*\n\n" +
                "*Example:*\nReply image + `.setpp`"
            )
        }

        // tmp folder
        const tmpDir = path.join(process.cwd(), "tmp")
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir)

        // download image
        const stream = await downloadContentFromMessage(quoted.msg, "image")
        let buffer = Buffer.from([])
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])

        const filePath = path.join(tmpDir, `botpp_${Date.now()}.jpg`)
        fs.writeFileSync(filePath, buffer)

        // set profile picture
        await conn.updateProfilePicture(
            conn.user.id,
            fs.readFileSync(filePath)
        )

        fs.unlinkSync(filePath)

        reply("*✅ BOT KI PROFILE PHOTO CHANGE HO GAYI HAI 😍*")

    } catch (e) {
        console.log("SETPP ERROR:", e)
        reply("*❌ PROFILE PHOTO CHANGE NAHI HO SAKI 🥺*")
    }
})
