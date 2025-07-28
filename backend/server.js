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
const crypto = require("crypto"); // For webhook signature verification
const taskService = require("./services/taskService"); // ✅ NEW: Import for direct service call (adjust path if needed)
const Project = require("./models/Project"); // ✅ NEW: Import Project model for dynamic secret fetch (adjust path if needed)

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

// --- NEW: GitHub Webhook Secret from .env (add GITHUB_WEBHOOK_SECRET=your-secret to your .env file) ---
const GITHUB_SECRET = process.env.GITHUB_WEBHOOK_SECRET || "your-default-secret";

// --- NEW: Helper to extract task refs like "Closes FE-UI-101" ---
function extractTaskRefs(msg = "") {
  return [...msg.matchAll(/(?:Closes|Fixes)\s+([A-Z\-0-9]+)/gi)].map(m => m[1]);
}

// --- NEW: Webhook Route (with dynamic async verification inside) ---
app.post(
  "/api/github/webhook",
  express.json(),  // Parse JSON first (verification moved inside for async)
  async (req, res) => {
    try {
      const buf = Buffer.from(JSON.stringify(req.body));  // Re-create buf from body
      const signature = req.headers["x-hub-signature-256"];
      if (!signature) {
        console.error("Missing x-hub-signature-256 header");
        throw new Error("No signature");
      }

      // Parse repo from payload
      const repoFullName = req.body.repository?.full_name;  // e.g., "gauravjikar/test-repo"
      if (!repoFullName) throw new Error("No repo in payload");

      // Fetch secret from DB based on repo
      const project = await Project.findOne({ githubRepo: repoFullName });
      const secret = project ? project.githubWebhookSecret : GITHUB_SECRET;  // Fallback to global if no match
      if (!secret) throw new Error("No secret found for this repo");

      const expectedSignature = "sha256=" + crypto.createHmac("sha256", secret).update(buf).digest("hex");
      console.log("Received Signature:", signature);
      console.log("Expected Signature:", expectedSignature);
      console.log("Repo:", repoFullName);
      console.log("Raw Body (first 100 chars):", buf.toString().substring(0, 100));

      if (signature !== expectedSignature) {
        console.error("Signature mismatch!");
        throw new Error("Invalid signature");
      }
      console.log("Signature verified successfully");

      // Proceed with event processing
      const event = req.headers["x-github-event"];
      let refs = [];
      let actor = "";

      if (event === "push" && req.body.commits) {
        req.body.commits.forEach((commit) => {
          actor = commit.author.name || req.body.sender?.login;
          refs.push(...extractTaskRefs(commit.message));
        });
      }

      if ((event === "pull_request" || event === "pull_request_review") && req.body.pull_request) {
        actor = req.body.sender?.login;
        refs.push(...extractTaskRefs(req.body.pull_request.title || ""));
        refs.push(...extractTaskRefs(req.body.pull_request.body || ""));
      }

      // ✅ CHANGED: Direct DB update via service (bypasses GraphQL auth)
      for (let taskId of refs) {
        try {
          await taskService.closeTask(taskId, actor);
          // Optional: If you want real-time notifications, add io.emit here or inside closeTask
        } catch (serviceErr) {
          console.error('Service error for task', taskId, serviceErr);
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
    console.log(`🔗 GitHub webhook ready at http://localhost:5000/api/github/webhook`); // NEW LOG
  });
}

startServer();
