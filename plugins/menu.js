const config = require('../config');
const moment = require('moment-timezone');
const { cmd, commands } = require('../inconnuboy');

// =============================================================
// 🔤 Styliser les majuscules
// =============================================================
function toUpperStylized(str) {
  const stylized = {
    A: 'ᴀ', B: 'ʙ', C: 'ᴄ', D: 'ᴅ', E: 'ᴇ', F: 'ғ', G: 'ɢ', H: 'ʜ',
    I: 'ɪ', J: 'ᴊ', K: 'ᴋ', L: 'ʟ', M: 'ᴍ', N: 'ɴ', O: 'ᴏ', P: 'ᴘ',
    Q: 'ǫ', R: 'ʀ', S: 's', T: 'ᴛ', U: 'ᴜ', V: 'ᴠ', W: 'ᴡ', X: 'x',
    Y: 'ʏ', Z: 'ᴢ'
  };
  return str.split('').map(c => stylized[c.toUpperCase()] || c).join('');
}

const normalize = str => str.toLowerCase().replace(/\s+menu$/, '').trim();

// =============================================================
// 📌 COMMANDE MENU (AVEC myquoted)
// =============================================================
cmd({
  pattern: "menu",
  alias: ["help", "allmenu", "💫"],
  use: ".menu",
  desc: "Show all bot commands",
  category: "menu",
  react: "💫",
  filename: __filename
}, 
async (conn, mek, m, { from, reply, myquoted }) => {

  try {
    const sender = m?.sender || mek?.key?.participant || 'unknown@s.whatsapp.net';
    const totalCommands = commands.length;

    const uptime = () => {
      let sec = process.uptime();
      let h = Math.floor(sec / 3600);
      let mn = Math.floor((sec % 3600) / 60);
      let s = Math.floor(sec % 60);
      return `${h}h ${mn}m ${s}s`;
    };

    const prefix = config.PREFIX || ".";
    const mode = config.WORK_TYPE?.toUpperCase() || "PUBLIC";

    // HEADER
    let menu = `
╭┄┄───────┄┄
│ ᴜꜱᴇʀ: @${sender.split("@")[0]}
│ ᴍᴏᴅᴇ: ${mode}
│ ᴘʀᴇғɪx: ${prefix}
│ ᴄᴍᴅꜱ: ${toUpperStylized(String(totalCommands))} ᴘʟᴜɢɪɴꜱ
│ ᴜᴘᴛɪᴍᴇ: ${uptime()}
│ ᴅᴇᴠ: bilal
╰┄┄────┄────┄┄`;

    // Catégories regroupées
    let categories = {};
    for (let c of commands) {
      if (!c?.pattern || !c?.category) continue;
      const cat = normalize(c.category);
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(c);
    }

    const sortedCats = Object.keys(categories).sort();

    // Construction du menu
    for (let cat of sortedCats) {
      const stylizedCat = toUpperStylized(cat);

      menu += `\n\n┌── 『 *${stylizedCat} ᴍᴇɴᴜ* 』`;

      const cmds = categories[cat]
        .filter(c => c.pattern)
        .sort((a, b) => a.pattern.localeCompare(b.pattern));

      for (let c of cmds) {
        const usage = c.pattern.split('|')[0];
        menu += `\n├❃ ${prefix}${toUpperStylized(usage)}`;
      }

      menu += `\n┗━━━━━━━━━━━━━━❃`;
    }

    // ENVOI AVEC myquoted
    await conn.sendMessage(from, {
      image: { url: config.IMAGE_PATH || 'https://pmd-img2url.koyeb.app/v/c6a14ba0c8147a72297276ba59995d15.jpg' },
      caption: menu,
      contextInfo: {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363296818107681@newsletter',
          newsletterName: 'BILAL KING',
          serverMessageId: 143
        }
      }
    }, { quoted: myquoted });

  } catch (e) {
    console.error("❌ Menu error:", e);
    reply(`❌ Menu error: ${e.message}`);
  }

});
