require("dotenv").config();
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");
const connectDB = require("./config/db");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const authMiddleware = require("./middleware/authmiddleware"); // ✅ Import auth middleware

const app = express();
app.use(cors());

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware, // ✅ Pass context function
  });

  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}/graphql`);
  });
}

connectDB();
startServer();
