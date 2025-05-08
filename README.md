# Discord Bot

Um bot do Discord pronto para rodar no Replit ou localmente, com sistema de comandos, logs, segurança e keepalive.

## 🚀 Funcionalidades

- ✉️ Reencaminhamento de mensagens privadas para um canal do Discord
- 🔄 Sistema de keepalive para manter o bot online 24/7
- 📝 Sistema de comandos dinâmicos (pasta `commands/`)
- 🔒 Segurança: validação de IDs, sanitização de mensagens, limite de uso
- 📋 Logs detalhados em arquivo (`bot.log`)

---

## 📁 Estrutura do Projeto

```
DC-BOT-V1/
├── commands/
│   └── ping.js        # Exemplo de comando /ping
├── index.js           # Código principal do bot
├── package.json       # Dependências e scripts
├── .gitignore         # Ignora node_modules e .env
├── README.md          # Este manual
```

---

## 📦 Dependências

- [discord.js](https://discord.js.org/) — interação com a API do Discord
- [express](https://expressjs.com/) — servidor para keepalive
- [dotenv](https://www.npmjs.com/package/dotenv) — variáveis de ambiente
- [simple-node-logger](https://www.npmjs.com/package/simple-node-logger) — sistema de logs

Instale tudo com:
```bash
npm install
```

---

## ⚙️ Variáveis de Ambiente

Configure no painel "Secrets" do Replit ou em um arquivo `.env` local:

| Variável         | Descrição                                                        |
|------------------|------------------------------------------------------------------|
| TOKEN            | Token do seu bot Discord                                         |
| USER_ID          | Seu ID de usuário Discord (opcional, para comandos restritos)     |
| CANAL_ID         | ID do canal padrão para mensagens privadas                        |
| SECRET_TOKEN     | Token secreto para endpoint keepalive (opcional)                  |
| KEEPALIVE_ENABLED| `true` para ativar keepalive, `false` para desativar (opcional)   |
| PORT             | Porta do servidor HTTP (Replit usa automaticamente)               |

---

## ✨ Como adicionar comandos

1. Crie um arquivo em `commands/`, exemplo:
   ```js
   // commands/ping.js
   module.exports = {
     name: 'ping',
     description: 'Responde com Pong!',
     execute(interaction) {
       interaction.reply('Pong! 🏓');
     }
   };
   ```
2. O bot carrega todos os comandos automaticamente ao iniciar.

---

## ☁️ Como rodar no Replit

1. **Importe o projeto para o Replit**
   - "Create Repl" > "Import from GitHub" > cole a URL do seu repositório.
2. **Instale as dependências**
   ```bash
   npm install
   ```
3. **Configure as variáveis de ambiente**
   - No painel "Secrets" (ícone de cadeado), adicione as variáveis necessárias (veja tabela acima).
4. **Execute o bot**
   ```bash
   npm start
   ```
   - Ou configure o botão "Run" para executar `npm start`.

---

## 💻 Como rodar localmente

1. Instale o Node.js (versão 16 ou superior)
2. Clone este repositório
3. Crie um arquivo `.env` na raiz com as variáveis necessárias
4. Instale as dependências:
   ```bash
   npm install
   ```
5. Inicie o bot:
   ```bash
   npm start
   ```

---

## 📝 Observações

- O sistema de logs grava em `bot.log` e também mostra no console.
- Para registrar comandos de barra no Discord, utilize o deploy de comandos (posso ajudar caso queira).
- O keepalive é útil para manter o bot online em ambientes como o Replit.

---

## ❓ Dúvidas
Abra uma issue ou entre em contato!

     ```
   - Ou configure o "Run" button do Replit para executar `npm start`.

6. **Mantenha o bot online**
   - Com `KEEPALIVE_ENABLED=true` e o endpoint `/` ativo, você pode usar serviços externos (como UptimeRobot) para pingar seu Replit e mantê-lo acordado.

### Dicas e Resolução de Problemas
- Se o bot não iniciar, verifique se todas as variáveis de ambiente obrigatórias estão preenchidas corretamente.
- O token do bot precisa ser válido e o bot deve estar convidado para o servidor Discord com permissões de leitura e escrita.
- O keepalive só funciona se o Replit permitir conexões HTTP externas (alguns planos gratuitos podem limitar isso).
- Para logs detalhados, veja a aba "Console" do Replit.
- Se precisar de comandos adicionais ou integração com BattleMetrics, adapte o código conforme necessário.

## 🤖 Comandos Disponíveis

- `!ping` — Verifica se o bot está online
- `!to <ID_DO_CANAL> <mensagem>` — Envia mensagem para canal específico

## 📱 Uso do Keepalive

O sistema de keepalive é útil para manter o bot online no Replit. Para ativar/desativar, ajuste a variável `KEEPALIVE_ENABLED` nas variáveis de ambiente do Replit:

- `KEEPALIVE_ENABLED=true`  — Ativa o keepalive
- `KEEPALIVE_ENABLED=false` — Desativa o keepalive

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

