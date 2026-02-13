const VideoCall = require("../models/VideoCall");

exports.createRoom = async (req, res) => {
  const roomId = Math.random().toString(36).substring(2, 10);
  await VideoCall.create({ roomId, participants: [] });
  res.json({ roomId });
};
