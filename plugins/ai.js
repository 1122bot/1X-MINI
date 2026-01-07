const { cmd } = require('../inconnuboy');
const axios = require('axios');

cmd({
  pattern: "ai",
  alias: ["gpt", "ask", "chatgpt"],
  react: "🤖",
  category: "ai",
  desc: "Chat with AI",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {

    if (!q) {
      return reply(
        "*🤖 AI COMMAND*\n\n" +
        "Is tarah use karo:\n" +
        "*.ai apna sawal*\n\n" +
        "Example:\n" +
        "*.ai Pakistan ka capital kia hai*"
      );
    }

    // typing feel
    await conn.sendPresenceUpdate('composing', from);

    // 🔗 AI API
    const API_URL = "https://ai-api-key-699ac94e6fae.herokuapp.com/api/ask";

    const res = await axios.post(API_URL, {
      prompt: q
    }, { timeout: 60000 });

    if (res.data && res.data.reply) {
      await reply(res.data.reply);
    } else {
      await reply("❌ AI se jawab nahi mila");
    }

  } catch (err) {
    console.log("AI COMMAND ERROR:", err);
    reply("❌ AI server error / busy hai");
  }
});
