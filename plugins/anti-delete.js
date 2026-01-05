const { cmd } = require('../inconnuboy');
const { setAntideleteStatus, getAntideleteStatus } = require('../data/Antidelete');

cmd({
    pattern: "antidelete",
    alias: ["antidel"],
    desc: "Turn Antidelete on/off",
    category: "owner",
    react: "🛡️"
},
async(conn, mek, m, { args, isOwner, reply, from }) => {
    if (!isOwner) return reply("*YEH COMMAND SIRF MERE LIE HAI 😎*");
    const mode = args[0]?.toLowerCase();

    if (mode === 'on' || mode === 'enable') {
        await setAntideleteStatus(from, true);
        await reply("🛡️ *Anti-Delete ENABLED*");
    } else if (mode === 'off' || mode === 'disable') {
        await setAntideleteStatus(from, false);
        await reply("💤 *Anti-Delete DISABLED*");
    } else {
        const current = await getAntideleteStatus(from);
        await reply(`*Current Status:* ${current ? "ON ✅" : "OFF ❌"}\nUsage: .antidelete on/off`);
    }
});
