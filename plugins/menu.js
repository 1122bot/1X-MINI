const config = require('../config');
const moment = require('moment-timezone');
const { cmd, commands } = require('../inconnuboy');

// =============================================================
// 🔤 Styliser les majuscules
// =============================================================
function toUpperStylized(str) {
  const stylized = {
    A: 'A', B: 'B', C: 'C', D: 'D', E: 'E', F: 'F', G: 'G', H: 'H',
    I: 'I', J: 'J', K: 'K', L: 'L', M: 'M', N: 'N', O: 'O', P: 'P',
    Q: 'Q', R: 'R', S: 'S', T: 'T', U: 'U', V: 'V', W: 'W', X: 'X',
    Y: 'Y', Z: 'Z'
  };
  return str.split('').map(c => stylized[c.toUpperCase()] || c).join('');
}

const normalize = str => str.toLowerCase().replace(/\s+menu$/, '').trim();

// =============================================================
// 📌 COMMANDE MENU (AVEC myquoted)
// =============================================================
cmd({
  pattern: "menu",
  alias: ["help", "allmenu", "m"], "me", "men", "menus", "list",
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
    *👑 BILAL-MD MENU 👑*
    
*╭┄┄───────┄┄👑*
*│ 👑 MODE :❯ ${mode}*
*│ 👑 PREFIX :❯ ${prefix}*
*│ 👑 COMMANDS :❯  ${toUpperStylized(String(totalCommands))}*
*│ 👑 UPTIME :❯ ${uptime()}*
*╰┄┄────┄────┄┄👑*


*HI @${sender.split("@")[0]} G 😍*
*MERE BOT KE COMMANDS DEKHE 🤗*`;

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

      menu += `\n\n┌── 『 *${stylizedCat} MENU* 』`;

      const cmds = categories[cat]
        .filter(c => c.pattern)
        .sort((a, b) => a.pattern.localeCompare(b.pattern));

      for (let c of cmds) {
        const usage = c.pattern.split('|')[0];
        menu += `\n├👑 ${prefix}${toUpperStylized(usage)}`;
      }

      menu += `\n┗━━━━━━━━━━━━━━❃`;
    }

    // ENVOI AVEC myquoted
    await conn.sendMessage(from, {
      image: { url: config.IMAGE_PATH || 'https://files.catbox.moe/kunzpz.png' },
      caption: menu,
      contextInfo: {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363296818107681@newsletter',
          newsletterName: 'BILAL-MD WHATSAPP BOT',
          serverMessageId: 143
        }
      }
    }, { quoted: myquoted });

  } catch (e) {
    console.error("❌ Menu error:", e);
    reply(`❌ Menu error: ${e.message}`);
  }

});
