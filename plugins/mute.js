const config = require('../config')
const { cmd, commands } = require('../inconnuboy')
const { sleep } = require('../lib/functions')

cmd({
    pattern: "mute",
    react: "🤐",
    alias: ["groupmute", "offgroup", "groupoff", "offgc", "gcoff"],
    desc: "Mute group (only admins can send messages)",
    category: "group",
    use: ".mute",
    filename: __filename
},
async (conn, mek, m, { from, reply, isGroup, senderNumber, groupAdmins }) => {
    try {
        if (!isGroup) return reply("*YEH COMMAND SIRF GROUPS ME USE KARE 😊*");

        const botOwner = conn.user.id.split(":")[0];
        const senderJid = senderNumber + "@s.whatsapp.net";

        if (!groupAdmins.includes(senderJid) && senderNumber !== botOwner) {
            return reply("*YEH COMMAND SIRF ADMINS USE KAR SAKTE HAI 😊*");
        }

        // Bot admin check
        const groupInfo = await conn.groupMetadata(from);
        const botNumber = conn.user.id.split(":")[0] + "@s.whatsapp.net";

        if (!groupInfo.participants.find(p => p.id === botNumber && p.admin)) {
            return reply("*PEHLE MUJHE GROUP ADMIN BANAO 🥺*");
        }

        await conn.groupSettingUpdate(from, "announcement");

        reply(
            "*🤐 GROUP MUTE HO GAYA 🤐*\n\n" +
            "🔒 Ab sirf admins message bhej sakte hain\n" +
            "🔓 Group baad me open kar diya jayega\n\n" +
            "*👑 BILAL MD WHATSAPP BOT 👑*"
        );

    } catch (e) {
        console.error("Mute Error:", e);
        reply("*❌ GROUP MUTE KARNE ME ERROR AYA 🥺*");
    }
});
