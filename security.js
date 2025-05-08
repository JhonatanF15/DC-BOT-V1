const { Collection } = require('discord.js');

// Função para validar IDs do Discord
function validateDiscordId(id) {
    if (!id || typeof id !== 'string') return false;
    // IDs do Discord são números de 17 a 19 dígitos
    return /^\d{17,19}$/.test(id);
}

// Função para limpar mensagens potencialmente perigosas
function sanitizeMessage(content) {
    if (!content) return '';
    // Remove caracteres de controle
    content = content.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
    // Remove caracteres de quebra de linha
    content = content.replace(/\r\n|\r|\n/g, ' ');
    // Remove caracteres especiais potencialmente perigosos
    content = content.replace(/[<>]/g, '');
    return content.trim();
}

// Função para validar URLs
function validateUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// Função para validar comandos
function validateCommand(command) {
    // Lista de comandos permitidos
    const allowedCommands = ['!ping', '!to'];
    return allowedCommands.includes(command.toLowerCase());
}

// Função para rate limiting
const rateLimits = new Collection();
const MAX_REQUESTS = 5; // Número máximo de requisições
const TIME_WINDOW = 60000; // Janela de tempo em milissegundos (1 minuto)

function checkRateLimit(userId) {
    const now = Date.now();
    const userRateLimit = rateLimits.get(userId) || [];
    
    // Remove requisições antigas
    const filtered = userRateLimit.filter(time => now - time < TIME_WINDOW);
    
    if (filtered.length >= MAX_REQUESTS) {
        return false;
    }
    
    // Adiciona nova requisição
    filtered.push(now);
    rateLimits.set(userId, filtered);
    return true;
}

module.exports = {
    validateDiscordId,
    sanitizeMessage,
    validateUrl,
    validateCommand,
    checkRateLimit
};
