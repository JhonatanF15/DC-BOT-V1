// index.js
require('dotenv').config();

// Inicia o keepalive se ativado
if (process.env.KEEPALIVE_ENABLED === 'true') {
  require('./keepalive');
}

const { Client, GatewayIntentBits, Partials } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

const TOKEN     = process.env.TOKEN;
const CANAL_ID  = process.env.CANAL_ID;
const USER_ID   = process.env.USER_ID;

// Verificação mínima
if (!TOKEN || !CANAL_ID || !USER_ID) {
  console.error('❌ Verifique se TOKEN, CANAL_ID e USER_ID estão definidos no .env');
  process.exit(1);
}

client.once('ready', () => {
  console.log(`🤖 Bot conectado como ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  // Ignora mensagens de bots
  if (message.author.bot) return;

  // Comando !ping
  if (message.content === '!ping') {
    return message.reply('🏓 Pong!');
  }

  // Comando !to <mensagem>
  if (message.content.startsWith('!to ')) {
    const msg = message.content.slice(4).trim();
    if (!msg) return message.reply('❌ Escreva uma mensagem após o comando.');
    try {
      const canal = await client.channels.fetch(CANAL_ID);
      await canal.send(`📩 Mensagem anônima: ${msg}`);
      return message.reply('✅ Mensagem enviada com sucesso!');
    } catch (err) {
      console.error('Erro ao enviar para o canal:', err);
      return message.reply('❌ Ocorreu um erro ao enviar a mensagem.');
    }
  }

  // Encaminhamento automático de DMs
  if (message.channel.type === 1) { // 1 = DM
    try {
      const canal = await client.channels.fetch(CANAL_ID);
      await canal.send(`📬 DM de ${message.author.tag} (${message.author.id}): ${message.content}`);
    } catch (err) {
      console.error('Erro ao encaminhar DM:', err);
    }
  }
});

client.login(TOKEN);
