const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const crypto = require("crypto");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const authMiddleware = require("./middleware/authmiddleware");
const setupSocket = require("./socket"); // Chat setup
const setupVideoSignaling = require("./socket/videoSignal"); // Video signaling setup
const taskService = require("./services/taskService");
const Project = require("./models/Project");

require('dotenv').config();

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    // Use FRONTEND_URL in production for CORS, fallback to localhost in development
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"], // Fallback transports
  pingInterval: 10000, // 10 seconds
  pingTimeout: 5000, // 5 seconds
});

// Setup Socket.io handlers
setupSocket(io);
setupVideoSignaling(io);

const GITHUB_SECRET = process.env.GITHUB_WEBHOOK_SECRET || "your-default-secret";

function extractTaskRefs(msg = "") {
  return [...msg.matchAll(/(?:Closes|Fixes)\s+([A-Z\-0-9]+)/gi)].map(
    (m) => m[1]
  );
}

// Github webhook route with dynamic secret verification
// Github webhook route with raw body parsing for signature verification
app.post(
  "/api/github/webhook",
  express.raw({ type: 'application/json' }), // Get raw buffer instead of parsed JSON
  async (req, res) => {
    try {
      const rawBody = req.body; // This is now a Buffer
      const signature = req.headers["x-hub-signature-256"];
      
      if (!signature) {
        console.error("Missing x-hub-signature-256 header");
        return res.status(400).json({ error: "No signature provided" });
      }

      // Parse the JSON from raw body for processing
      const payload = JSON.parse(rawBody.toString());
      
      const repoFullName = payload.repository?.full_name;
      if (!repoFullName) {
        return res.status(400).json({ error: "No repository in payload" });
      }

      const project = await Project.findOne({ githubRepo: repoFullName });
      const secret = project ? project.githubWebhookSecret : GITHUB_SECRET;
      
      if (!secret) {
        return res.status(400).json({ error: "No secret found for this repo" });
      }

      // Now this will work correctly with the raw buffer
      const expectedSignature =
        "sha256=" + crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

      console.log("Received Signature:", signature);
      console.log("Expected Signature:", expectedSignature);
      console.log("Repo:", repoFullName);

      if (signature !== expectedSignature) {
        console.error("Signature mismatch!");
        return res.status(401).json({ error: "Invalid signature" });
      }
      
      console.log("Signature verified successfully");

      const event = req.headers["x-github-event"];
      let refs = [];
      let actor = "";

      if (event === "push" && payload.commits) {
        payload.commits.forEach((commit) => {
          actor = commit.author.name || payload.sender?.login;
          refs.push(...extractTaskRefs(commit.message));
        });
      }

      if (
        (event === "pull_request" || event === "pull_request_review") &&
        payload.pull_request
      ) {
        actor = payload.sender?.login;
        refs.push(...extractTaskRefs(payload.pull_request.title || ""));
        refs.push(...extractTaskRefs(payload.pull_request.body || ""));
      }

      // Update tasks
      for (let taskId of refs) {
        try {
          await taskService.closeTask(taskId, actor);
        } catch (serviceErr) {
          console.error("Service error for task", taskId, serviceErr);
        }
      }

      res.status(200).json({ success: true, updated: refs.length, refs });
    } catch (err) {
      console.error("GitHub webhook error:", err);
      res.status(500).json({ error: "Webhook processing failed" });
    }
  }
);


const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const authContext = await authMiddleware({ req });
    if (process.env.NODE_ENV !== "production") {
      console.log("Context in ApolloServer:", authContext);
    }
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

  const PORT = process.env.PORT || 5000;
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}${apolloServer.graphqlPath}`);
    console.log(`📡 Socket.io listening on ws://localhost:${PORT}`);
    console.log(`🎥 Video signaling ready`);
    console.log(`🔗 GitHub webhook ready at http://localhost:${PORT}/api/github/webhook`);
  });
}

startServer();

// Optional: Production-only express settings
if (process.env.NODE_ENV === "production") {
  // Serve frontend static files here if you bundle frontend with backend
  // app.use(express.static('frontend_build_path'));

  // Catch-all route to serve frontend (if applicable)
  app.get("*", (req, res) => {
    res.send("Backend API is live");
    // Or serve index.html if monorepo frontend + backend: res.sendFile('index.html');
  });

  // Basic error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
  });
}
