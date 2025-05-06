# Discord Bot

Um bot do Discord que reencaminha mensagens privadas para um canal específico e monitora um servidor ARK via BattleMetrics.

## 🚀 Funcionalidades

- ✉️ Reencaminhamento de mensagens privadas para canal do Discord
- 📊 Monitoramento de servidor ARK via BattleMetrics
- 🔄 Sistema de keepalive para manter o bot online 24/7
- 🔒 Sistema de segurança e validação de entrada

## 🛡️ Segurança

### Configuração do .env

```shell
# Bot Configuration
TOKEN=seu_token_aqui
USER_ID=seu_id_aqui
CANAL_ID=seu_canal_aqui
KEEPALIVE_ENABLED=false

# BattleMetrics Configuration
BATTLEMETRICS_STATUS_CHANNEL_ID=seu_canal_status_aqui
BATTLEMETRICS_PLAYERS_CHANNEL_ID=seu_canal_jogadores_aqui
```

### Proteções Implementadas

- ✅ Validação de IDs do Discord
- ✅ Limite de 5 mensagens por minuto por usuário
- ✅ Sanitização de mensagens
- ✅ Lista restrita de comandos permitidos
- ✅ Logs detalhados

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/discord-bot.git
cd discord-bot
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o arquivo `.env` com suas variáveis:
```bash
cp .env.example .env
# Edite o .env com seus valores
```

4. Inicie o bot:
```bash
npm start
```

## 🤖 Comandos Disponíveis

- `!ping` - Verifica se o bot está online
- `!to <ID_DO_CANAL> <mensagem>` - Envia mensagem para canal específico

## 📱 Uso do Keepalive

O bot inclui um sistema de keepalive que mantém o bot online 24/7 quando rodando no Replit. Para ativar/desativar:

```shell
KEEPALIVE_ENABLED=true  # Ativar
KEEPALIVE_ENABLED=false # Desativar
```

## 🛠️ Desenvolvimento

### Dependências

```json
{
  "dependencies": {
    "discord.js": "^14.14.1",
    "dotenv": "^16.3.1",
    "node-fetch": "^3.3.2",
    "cheerio": "^1.0.0-rc.12",
    "express": "^4.18.2"
  }
}
```

### Testes

Atualmente não há testes automatizados implementados. Recomenda-se testar manualmente as funcionalidades após cada modificação.

## 📝 Licença

Este projeto está sob a licença ISC. Veja o arquivo LICENSE para mais detalhes.

## 🤝 Contribuições

Contribuições são bem-vindas! Por favor, faça um fork do projeto e crie um pull request com suas melhorias.
