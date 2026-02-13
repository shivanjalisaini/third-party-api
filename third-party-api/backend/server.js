require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");

const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/call", require("./routes/call.routes"));
app.use("/api/sms", require("./routes/sms.routes"));
app.use("/api/email", require("./routes/email.routes"));
app.use("/api/whatsapp", require("./routes/whatsapp.routes"));
app.use("/api/video", require("./routes/video.routes"));

// CREATE HTTP SERVER
const server = http.createServer(app);

// SOCKET.IO FOR WEBRTC SIGNALING
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

require("./services/webrtc.service")(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`Server + WebRTC running on ${PORT}`)
);
