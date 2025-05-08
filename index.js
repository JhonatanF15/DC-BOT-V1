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
