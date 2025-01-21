const http = require("http");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const connectDB = require("./src/db/conn.js"); // Import the database connection


// Attach the HTTP server to the Express app
const server = http.createServer(app);
const { Server } = require("socket.io");

// routes
const user = require("./src/routes/user.js");

// Create a new Socket.IO instance attached to the HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Ensure WebSocket CORS is also configured
    methods: ["GET", "POST"],
  },
});
connectDB();
app.use(cors({ origin: "http://localhost:3000" }));

// Handle connections here
io.on("connection", (socket) => {
  console.log("A new user has connected!", socket.id);
});

app.get("/", (req, res) => {
  res.send({ message: "Web sockets tut!" });
});
app.use('/api/user', user);

app.use(cors({ origin: "*" }));

// Start the server and listen on port 8000
server.listen(8000, () => {
  console.log("Server is listening on port 8000");
});
