// Importa bibliotecas essenciais
// Adicionado 'Partials' para lidar corretamente com DMs
const { Client, GatewayIntentBits, ChannelType, Partials, AttachmentBuilder } = require('discord.js');
const { validateDiscordId, sanitizeMessage, validateCommand, checkRateLimit } = require('./security');
require('dotenv').config(); // Permite usar variáveis de ambiente locais (opcional fora do Replit)

// Função de log com emojis
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: 'ℹ️',
    error: '❌',
    success: '✅',
    warning: '⚠️'
  }[type];

  console.log(`[${timestamp}] ${prefix} ${message}`);
}

// Carrega as variáveis de ambiente
const TOKEN = process.env.TOKEN;
// CANAL_ID agora é menos relevante para o envio principal, mas pode ser útil manter para validação ou outros usos.
const CANAL_ID_DEFAULT = process.env.CANAL_ID; // Renomeado para clareza, se quiser manter um padrão
const USUARIO_AUTORIZADO = process.env.USER_ID;

// Verifica se as variáveis de ambiente essenciais estão configuradas
if (!TOKEN) throw new Error('❌ TOKEN não configurado no .env');
// A verificação do CANAL_ID pode ser opcional agora, dependendo se você ainda precisa dele.
if (!CANAL_ID_DEFAULT) log('⚠️ CANAL_ID não configurado no .env (usado como padrão ou para validação inicial)', 'warning');
if (!USUARIO_AUTORIZADO) throw new Error('❌ USUARIO_AUTORIZADO não configurado no .env');

// Verifica se os IDs são válidos (básico)
if (CANAL_ID_DEFAULT && isNaN(parseInt(CANAL_ID_DEFAULT))) log('⚠️ CANAL_ID inválido no .env - deve ser um número de ID válido', 'warning');
if (isNaN(parseInt(USUARIO_AUTORIZADO))) throw new Error('❌ USUARIO_AUTORIZADO inválido - deve ser um número de ID válido');

// Mostra status completo
log(`✅ Configurações carregadas:`);
log(`  - Token: Configurado`);
log(`  - Canal ID Padrão: ${CANAL_ID_DEFAULT || 'Não definido'}`);
log(`  - Usuário autorizado definido.`);

// Instancia o bot com os intents e partials necessários
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ],
  partials: [Partials.Channel] // ESSENCIAL para DMs
});

// Quando o bot iniciar
client.on('ready', () => {
  log(`🤖 Bot iniciado como ${client.user.tag}`);
  log(`ID do bot: ${client.user.id}`);
  log(`➡️ Pronto para receber mensagens!`);
});

// --- INÍCIO DAS ALTERAÇÕES PRINCIPAIS ---
// Quando o bot receber uma nova mensagem
client.on('messageCreate', async (msg) => {
  try {
    // Ignora mensagens enviadas por outros bots ou webhooks
    if (msg.author.bot || msg.webhookId) return;

    // Verifica rate limiting
    if (!checkRateLimit(msg.author.id)) {
      return msg.reply('❌ Você está enviando mensagens muito rápido. Aguarde um minuto.').catch(console.error);
    }

    // Limpa e valida a mensagem
    const sanitizedContent = sanitizeMessage(msg.content);
    if (!sanitizedContent) {
      return msg.reply('❌ Mensagem inválida').catch(console.error);
    }

    // Log detalhado da mensagem recebida
    const channelTypeString = ChannelType[msg.channel.type] || `Desconhecido (${msg.channel.type})`;
    log(`👤 Recebida mensagem de ${msg.author.tag}`);
    log(`  - Tipo de canal: ${channelTypeString}`);
    log(`  - Conteúdo: ${sanitizedContent.substring(0, 50)}${sanitizedContent.length > 50 ? '...' : ''}`);
    if (msg.attachments.size > 0) {
        log(`  - Anexos: ${msg.attachments.size}`);
    }

    // Responde ao comando de verificação (funciona em DMs e canais de servidor)
    if (sanitizedContent === '!ping') {
       log(`✅ Recebido !ping de ${msg.author.tag}. Respondendo...`);
       // Adicionado try-catch para o reply, pois ele também pode falhar
       try {
           await msg.reply('pong');
       } catch (replyError) {
           log(`❌ Erro ao responder !ping para ${msg.author.tag}.`, 'error');
       }
       return; // Importante retornar após tratar o comando
    }

    // Verifica se é uma mensagem privada (DM) do usuário autorizado
    if (msg.channel.type === ChannelType.DM) {
      // Valida o ID do usuário
      if (!validateDiscordId(msg.author.id)) {
        return msg.reply('❌ ID de usuário inválido').catch(console.error);
      }

      // Verifica se é o usuário autorizado
      if (msg.author.id !== USUARIO_AUTORIZADO) {
        return;
      }
      log(`✅ Identificada DM do usuário autorizado`);

      // Define o prefixo do comando para direcionar a mensagem
      const commandPrefix = '!to ';
      let targetChannelId = null;
      let actualMessageContent = '';

      // Verifica se a mensagem começa com o prefixo
      if (msg.content.startsWith(commandPrefix)) {
          log(`DM começa com o prefixo "${commandPrefix}". Processando...`);
          // Pega a string após o prefixo
          const contentAfterPrefix = msg.content.substring(commandPrefix.length);
          // Separa a primeira palavra (potencial ID) do resto
          const firstSpaceIndex = contentAfterPrefix.indexOf(' ');

          let potentialId;
          if (firstSpaceIndex === -1) {
              // Se não há espaço, talvez seja só o ID? (sem mensagem)
              potentialId = contentAfterPrefix;
              actualMessageContent = ''; // Nenhuma mensagem após o ID
          } else {
              potentialId = contentAfterPrefix.substring(0, firstSpaceIndex);
              actualMessageContent = contentAfterPrefix.substring(firstSpaceIndex + 1).trim();
          }

          // Validação básica do ID (sequência de dígitos)
          if (potentialId && /^\d+$/.test(potentialId)) {
              targetChannelId = potentialId;
              log(`ID do canal extraído`);
              if(actualMessageContent) {
                  log(`Conteúdo da mensagem extraído`);
              } else {
                  log(`Nenhum conteúdo de texto extraído após o ID.`);
              }
          } else {
              log(`⚠️ ID do canal inválido ou ausente após o prefixo "${commandPrefix}".`, 'warning');
              try {
                  await msg.author.send(`❌ Formato inválido. O ID do canal após "${commandPrefix}" parece estar faltando ou não é um número válido. Use o formato: \`${commandPrefix}<ID_DO_CANAL> Sua Mensagem\``);
              } catch (dmError) {
                  log('⚠️ Não foi possível notificar o usuário sobre o erro de formato via DM.', 'warning');
              }
              return; // Para de processar esta mensagem específica
          }
      } else {
          // Se não começa com o prefixo, informa o usuário sobre como usar
          log(`⚠️ DM não iniciada com o prefixo necessário "${commandPrefix}". Instruindo usuário.`, 'warning');
          try {
              await msg.author.send(`ℹ️ Para encaminhar uma mensagem para um canal específico, por favor, use o formato: \`${commandPrefix}<ID_DO_CANAL> Sua Mensagem\`. Sua mensagem original não foi encaminhada.`);
          } catch (dmError) {
              log('⚠️ Não foi possível instruir o usuário sobre o formato via DM.', 'warning');
          }
          return; // Para de processar esta mensagem específica
      }

      // Se chegou até aqui, um targetChannelId válido foi extraído
      // Continua com a lógica de buscar o canal e enviar
      try {
        log(`🔍 Tentando buscar canal de destino`);
        const canal = await client.channels.fetch(targetChannelId);

        // Verifica se o canal foi encontrado
        if (!canal) {
          throw new Error(`Canal não encontrado ou o bot não tem acesso.`);
        }
        // Verifica se é um canal onde se pode enviar mensagens
        if (!canal.isTextBased()) {
             throw new Error(`Canal não é um canal de texto.`);
        }

        log(`✅ Canal de destino encontrado`);

        // Prepara o conteúdo a ser enviado
        let options = {};
        // Adiciona o conteúdo de texto extraído, se houver
        if (actualMessageContent) {
            options.content = actualMessageContent;
        }

        // Se há anexos na mensagem original, adiciona-os
        if (msg.attachments.size > 0) {
          log(`🖼️ Preparando anexos para envio`);
          options.files = [...msg.attachments.values()];
        }

        // Envia a mensagem apenas se houver conteúdo de texto ou arquivos
        if (options.content || options.files) {
             log(`📤 Enviando mensagem para o canal...`);
             await canal.send(options);
             log('✅ Mensagem e/ou anexos enviados com sucesso!');
             // Confirmação visual para o usuário (opcional)
             try { await msg.react('✅'); } catch { log('⚠️ Não foi possível reagir à DM do usuário.', 'warning'); }
        } else {
             log('⚠️ Mensagem processada estava vazia após o comando (sem texto útil ou anexos). Nada a enviar.', 'warning');
             try {
                 await msg.author.send(`⚠️ Sua mensagem após o comando \`${commandPrefix}${targetChannelId}\` não continha texto ou anexos válidos. Nada foi enviado.`);
             } catch (dmError) {
                 log('⚠️ Não foi possível notificar o usuário sobre mensagem vazia via DM.', 'warning');
             }
        }

      } catch (error) {
        // Erros ao buscar canal ou enviar mensagem
        log(`❌ Erro ao buscar canal ou enviar mensagem.`, 'error');
        try {
          // Tenta enviar mensagem de erro para o autor original
          await msg.author.send(`❌ Ocorreu um erro ao tentar replicar sua mensagem.`);
          // Reação de erro na DM original (opcional)
          try { await msg.react('❌'); } catch { /* ignora se não puder reagir */ }
        } catch (dmError) {
          log('⚠️ Não foi possível notificar o usuário sobre o erro de envio via DM.', 'warning');
        }
      }
    } else if (msg.channel.type === ChannelType.DM && msg.author.id !== USUARIO_AUTORIZADO) {
        // Log para DMs de usuários não autorizados (sem ação necessária)
        log(`👤 Recebida DM de usuário não autorizado.`);
    }
    // Mensagens em canais de servidor ou DMs não autorizadas (sem o prefixo) simplesmente terminam aqui.

  } catch (error) {
    // Captura erros gerais inesperados no processamento da mensagem
    log(`❌ Erro crítico inesperado ao processar mensagem.`, 'error');
  }
});
// --- FIM DAS ALTERAÇÕES PRINCIPAIS ---

// Tratamento de erro não capturado (mantido)
process.on('unhandledRejection', error => {
    log('❌ Erro não tratado (unhandledRejection)!', 'error');
});
process.on('uncaughtException', error => {
    log('❌ Erro não capturado (uncaughtException)!', 'error');
    // process.exit(1); // Considere descomentar em produção para reiniciar via gerenciador de processos
});


// FUNCIONANDO!!! Inicia o bot com o token
log('🚀 Iniciando login do bot...');
client.login(TOKEN);