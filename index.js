require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  Partials,
  ChannelType,
  EmbedBuilder,
} = require("discord.js");

console.log("> ENV DEBUG:");
console.log("  TOKEN:", process.env.TOKEN ? "✅ OK" : "❌ MISSING");
console.log("  CANAL_ID:", process.env.CANAL_ID ? "✅ OK" : "❌ MISSING");
console.log("  USER_ID:", process.env.USER_ID ? "✅ OK" : "❌ MISSING");
console.log("  KEEPALIVE_ENABLED:", process.env.KEEPALIVE_ENABLED);

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
const DEFAULT_CHANNEL = process.env.CANAL_ID;

if (!TOKEN || !DEFAULT_CHANNEL) {
  console.error("❌ Verifique se TOKEN e CANAL_ID estão definidos");
  process.exit(1);
}

const COLORS = {
  red: "#FF0000",
  orange: "#FFA500",
  yellow: "#FFFF00",
  green: "#008000",
  blue: "#0000FF",
  indigo: "#4B0082",
  violet: "#EE82EE",
};
const COLOR_KEYS = Object.keys(COLORS);
function getRandomColor() {
  return COLORS[COLOR_KEYS[Math.floor(Math.random() * COLOR_KEYS.length)]];
}

function parseSection(block, tag) {
  const regex = new RegExp(`#${tag}\\s+([^#]+)`, "i");
  const m = regex.exec(block);
  return m ? m[1].trim() : null;
}

client.once("ready", () => {
  console.log(`🤖 Bot conectado como ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // ping
  if (message.content === "!ping") {
    const pong = new EmbedBuilder()
      .setColor("#2E8B57")
      .setTitle("🏓 Pong!")
      .setDescription(`Latência: ${client.ws.ping}ms`);
    return message.reply({ embeds: [pong] });
  }

  // .j via DM
  if (
    message.channel.type === ChannelType.DM &&
    message.content.startsWith(".j")
  ) {
    // **1) Separe primeira linha do resto**
    const [firstLine, ...restLines] = message.content.split("\n");
    const parts = firstLine.slice(2).trim().split(/\s+/);
    const channelId = parts.shift() || DEFAULT_CHANNEL;
    let color = getRandomColor();
    if (parts[0] && COLORS[parts[0].toLowerCase()]) {
      color = COLORS[parts.shift().toLowerCase()];
    }

    // **2) Mantenha o texto original com quebras**
    const raw = restLines.join("\n").trim();
    if (!raw) {
      return message.reply("❌ Não encontrei conteúdo após a primeira linha.");
    }

    // **3) Separe blocos por #embed sem tocar nas quebras**
    const blocks = raw
      .split(/#embed/i)
      .map((b) => b.trim())
      .filter(Boolean);

    if (blocks.length === 0) {
      return message.reply("⚠️ Nenhum bloco de embed encontrado.");
    }

    // **4) Monte cada embed**
    const embeds = blocks.map((block) => {
      const title = parseSection(block, "titulo");
      const subtitle = parseSection(block, "subtitulo");
      const descr = parseSection(block, "mensagem") || block;
      const footer = parseSection(block, "rodape");
      const image = parseSection(block, "imagem");
      const thumb = parseSection(block, "thumbnail");
      const url = parseSection(block, "link");

      const e = new EmbedBuilder().setColor(color);

      if (title) e.setTitle(title);
      if (url) e.setURL(url);
      if (descr) {
        const text = subtitle ? `*${subtitle}*\n\n${descr}` : descr;
        e.setDescription(text);
      }
      if (footer) e.setFooter({ text: footer });
      if (image) e.setImage(image);
      if (thumb) e.setThumbnail(thumb);

      return e;
    });

    // **5) Envie**
    try {
      const channel = await client.channels.fetch(channelId);
      if (!channel || channel.type !== ChannelType.GuildText) {
        return message.reply("❌ Canal de texto inválido.");
      }
      await channel.send({ embeds });
      return message.reply(`✅ ${embeds.length} embed(s) enviadas!`);
    } catch (err) {
      console.error("Erro ao enviar embeds:", err);
      return message.reply("❌ Falha ao enviar embeds.");
    }
  }

  // ignora outras DMs
  if (message.channel.type === ChannelType.DM) return;
});

client.login(TOKEN).catch((err) => {
  console.error("❌ Falha ao fazer login:", err);
  process.exit(1);
});
