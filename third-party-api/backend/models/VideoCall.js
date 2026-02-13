const mongoose = require("mongoose");

const VideoCallSchema = new mongoose.Schema({
  roomId: String,
  participants: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("VideoCall", VideoCallSchema);
