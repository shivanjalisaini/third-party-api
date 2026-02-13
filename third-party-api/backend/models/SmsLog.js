const mongoose = require("mongoose");

const SmsLogSchema = new mongoose.Schema({
  phone: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SmsLog", SmsLogSchema);
