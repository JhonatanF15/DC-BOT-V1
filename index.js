// index.js
require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  Partials,
  ChannelType,
} = require("discord.js");

// Debug de variáveis de ambiente
console.log("> ENV DEBUG:");
console.log("  TOKEN:", process.env.TOKEN ? "✅ OK" : "❌ MISSING");
console.log("  CANAL_ID:", process.env.CANAL_ID ? "✅ OK" : "❌ MISSING");
console.log("  USER_ID:", process.env.USER_ID ? "✅ OK" : "❌ MISSING");
console.log("  KEEPALIVE_ENABLED:", process.env.KEEPALIVE_ENABLED);

// Inicia keepalive se configurado
if (process.env.KEEPALIVE_ENABLED === "true") {
  require("./keepalive");
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

const TOKEN = process.env.TOKEN;
const CANAL_ID = process.env.CANAL_ID;
const USER_ID = process.env.USER_ID;

if (!TOKEN || !CANAL_ID || !USER_ID) {
  console.error("❌ Verifique se TOKEN, CANAL_ID e USER_ID estão definidos");
  process.exit(1);
}

client.once("ready", () => {
  console.log(`🤖 Bot conectado como ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // !ping
  if (message.content === "!ping") {
    return message.reply("🏓 Pong!");
  }

  // !to <mensagem>
  if (message.content.startsWith("!to ")) {
    const msg = message.content.slice(4).trim();
    if (!msg) {
      return message.reply("❌ Escreva uma mensagem após o comando.");
    }
    try {
      const canal = await client.channels.fetch(CANAL_ID);

      // Nova formatação com "citação vermelha"
      await canal.send(`📩 **Mensagem anônima:**\n\`\`\`diff\n- ${msg}\n\`\`\``);

      return message.reply("✅ Mensagem enviada com sucesso!");
    } catch (err) {
      console.error("Erro ao enviar mensagem anônima:", err);
      return message.reply("❌ Ocorreu um erro ao enviar a mensagem.");
    }
  }

  // Encaminhamento de DMs
  if (message.channel.type === ChannelType.DM) {
    try {
      const canal = await client.channels.fetch(CANAL_ID);
      await canal.send(
        `📬 DM de ${message.author.tag} (${message.author.id}):\n${message.content}`,
      );
    } catch (err) {
      console.error("Erro ao encaminhar DM:", err);
    }
  }
});

// Login com tratamento de possível falha
client.login(TOKEN).catch((err) => {
  console.error("❌ Falha ao fazer login:", err);
  process.exit(1);
});
