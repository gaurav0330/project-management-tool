const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const authMiddleware = require("./middleware/authmiddleware");
const setupSocket = require("./socket"); // Your existing chat setup
const setupVideoSignaling = require("./socket/videoSignal"); // ✅ ADD THIS LINE

dotenv.config();
  
const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Set up Socket.io for chat
setupSocket(io);

// ✅ ADD THIS LINE - Set up video calling signaling
setupVideoSignaling(io);

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const authContext = await authMiddleware({ req });
    console.log("Context in ApolloServer:", authContext);
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

  httpServer.listen(5000, () => {
    console.log(`🚀 Server running at http://localhost:5000${apolloServer.graphqlPath}`);
    console.log(`📡 Socket.io listening on ws://localhost:5000`);
    console.log(`🎥 Video signaling ready`); // ✅ ADD THIS LOG
  });
}

startServer();
