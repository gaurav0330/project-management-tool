const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io"); // Import Server from socket.io
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const authMiddleware = require("./middleware/authmiddleware");
const setupSocket = require("./socket"); // Import the setupSocket function
const cors = require("cors");

dotenv.config();

const app = express();


const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173/";
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
// Create HTTP server
const httpServer = http.createServer(app);

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: FRONTEND_URL, // Allow your frontend URL
    methods: ["GET", "POST"], // Allow necessary HTTP methods
    credentials: true // Allow credentials if needed
  }
});

// Set up Socket.io using the setupSocket function
setupSocket(io);

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const authContext = await authMiddleware({ req });
    return authContext;
  },
});

async function startServer() {
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("✅ MongoDB Connected Successfully");

  // Start the HTTP server
  httpServer.listen(5000, () => {
    console.log(`🚀 Server running at http://localhost:5000${apolloServer.graphqlPath}`);
    console.log(`📡 Socket.io listening on ws://localhost:5000`);
  });
}

startServer();
 