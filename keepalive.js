// Importa o Express, framework leve para servidores HTTP
const express = require('express');

// Função para iniciar o keepalive com tratamento de erros
function iniciarKeepalive() {
  try {
    const app = express();
    // Rota protegida por token seguro para manter o bot online
    app.get('/', (req, res) => {
      const token = req.query.token;
      if (!token || token !== process.env.SECRET_TOKEN) {
        return res.status(401).send('Não autorizado: token inválido ou ausente.');
      }
      res.send('✅ Bot ativo - keepalive funcionando');
    });
    // Define a porta de escuta do Replit
    const PORT = process.env.PORT || 3000;
    const server = app.listen(PORT, () => {
      console.log('🌐 Serviço iniciado');
    });
    // Retorna ambos para controle externo
    return { app, server };
  } catch (error) {
    console.error('❌ Ocorreu um erro');
    throw error;
  }
}

// Função para parar o keepalive com tratamento de erros
function pararKeepalive(server) {
  try {
    if (server) {
      server.close(() => {
        console.log('❌ Serviço parado');
      });
    }
  } catch (error) {
    console.error('❌ Ocorreu um erro');
  }
}

// Exporta as funções
module.exports = {
  iniciarKeepalive,
  pararKeepalive
};
