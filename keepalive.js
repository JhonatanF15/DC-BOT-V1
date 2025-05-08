// keepalive.js
// Servidor Express para manter o Repl ativo via ping externo

const express = require('express');
const app = express();

// Porta definida pelo Replit ou fallback para 3000
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot está ativo!');
});

if (process.env.KEEPALIVE_ENABLED === 'true') {
  app.listen(PORT, () => {
    console.log(`Servidor keepalive rodando na porta ${PORT}`);
  });
} else {
  console.log('Keepalive desativado (KEEPALIVE_ENABLED != true)');
}

module.exports = app;
