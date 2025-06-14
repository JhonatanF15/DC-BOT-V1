**Desenvolvedor Node.js – Projeto DC-BOT-V1**
Desenvolvi e implementei um bot para Discord utilizando Node.js e a biblioteca discord.js. O bot interpreta comandos via DM, transforma as mensagens em embeds visuais e os publica dinamicamente em canais públicos. O projeto utiliza variáveis de ambiente seguras (`dotenv`), possui sistema de logs e validação robusta de entradas. Aplicado em contexto real com lógica de parsing customizada.

- Linguagens: JavaScript (ES6+)
- Backend: Node.js
- Bibliotecas: discord.js, dotenv
- Conceitos: API Discord, EmbedBuilder, Regex, Variáveis de Ambiente
- DevOps: Deploy em ambientes online com keepalive


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
