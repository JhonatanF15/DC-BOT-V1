# Discord Bot

Um bot do Discord que reencaminha mensagens privadas para um canal específico

## 🚀 Funcionalidades

- ✉️ Reencaminhamento de mensagens privadas para canal do Discord
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



### Proteções Implementadas

- ✅ Validação de IDs do Discord
- ✅ Limite de 5 mensagens por minuto por usuário
- ✅ Sanitização de mensagens
- ✅ Lista restrita de comandos permitidos
- ✅ Logs detalhados

## ☁️ Rodando no Replit

Siga os passos abaixo para rodar este bot no [Replit](https://replit.com):

1. **Importe o projeto para o Replit**
   - Clique em "Create Repl" > "Import from GitHub" e cole a URL do seu repositório.

2. **Instale as dependências**
   - No shell do Replit, execute:
     ```bash
     npm install
     ```

3. **Configure as variáveis de ambiente**
   - No painel do Replit, clique em "Secrets" (ícone de cadeado) ou "Environment Variables".
   - Adicione as variáveis abaixo com seus respectivos valores:
     - `TOKEN` — Token do seu bot Discord
     - `USER_ID` — Seu ID de usuário Discord (quem pode usar comandos especiais)
     - `CANAL_ID` — ID do canal padrão para onde as mensagens privadas serão encaminhadas
     - `SECRET_TOKEN` — Um token secreto para o endpoint keepalive (pode ser qualquer string forte)
     - `KEEPALIVE_ENABLED` — `true` para ativar o keepalive, `false` para desativar
   - **Não é necessário criar o arquivo `.env` no Replit, apenas use o painel de variáveis.**

4. **(Opcional) Ajuste a porta do servidor**
   - O código já está preparado para usar `process.env.PORT`, que é exigido pelo Replit.

5. **Execute o bot**
   - No shell do Replit, rode:
     ```bash
     npm start
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

