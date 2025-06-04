require("dotenv").config();
const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const { json } = require("body-parser");
const cors = require("cors");

const { typeDefs } = require("./schema");
const { resolvers } = require("./resolvers");
const { setupBlockchainListener } = require("./blockchain");
const { setupDatabase } = require("./database");

// Configuração do servidor Express
const app = express();
const PORT = 4000;

// Configuração do CORS
app.use(cors());

// Configuração do Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Rota / com hello world
app.get('/', (req, res) => {
  res.send('Hello World!')
}); 

async function startServer() {
  try {
    // Inicializa o Apollo Server
    await server.start();
    console.log("✅ Apollo Server inicializado");

    // Middleware do Apollo
    app.use("/graphql", json(), expressMiddleware(server));
    console.log("✅ GraphQL endpoint configurado em /graphql");

    // Inicializa o banco de dados
    await setupDatabase();
    console.log("✅ Banco de dados inicializado");

    // Inicializa o listener da blockchain
    await setupBlockchainListener();
    console.log("✅ Listener da blockchain configurado");

    // Inicia o servidor
    app.listen(PORT, () => {
      console.log(`
🚀 Servidor rodando em http://localhost:${PORT}/graphql
📝 GraphQL Playground disponível em http://localhost:${PORT}/graphql
      `);
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar o servidor:", error);
    process.exit(1);
  }
}

// Tratamento de erros não capturados
process.on("unhandledRejection", (error) => {
  console.error("❌ Erro não tratado:", error);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("❌ Exceção não capturada:", error);
  process.exit(1);
});

startServer();
