const config = require('../config')
const { cmd, commands } = require('../inconnuboy')
const { sleep } = require('../lib/functions')

cmd({
    pattern: "unmute",
    react: "🔓",
    alias: ["groupunmute", "ongroup", "groupopen", "ongc", "gcon"],
    desc: "Unmute group (all members can chat)",
    category: "group",
    use: ".unmute",
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

        await conn.groupSettingUpdate(from, "not_announcement");

        reply(
            "*🔓 GROUP OPEN HO GAYA 🔓*\n\n" +
            "✅ Ab sab members message bhej sakte hain\n" +
            "🤍 Group phir se active ho gaya\n\n" +
            "*👑 BILAL MD WHATSAPP BOT 👑*"
        );

    } catch (e) {
        console.error("Unmute Error:", e);
        reply("*❌ GROUP OPEN KARNE ME ERROR AYA 🥺*");
    }
});
