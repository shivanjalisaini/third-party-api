const mongoose = require("mongoose");

const callLogSchema = new mongoose.Schema({
  to: String,
  message: String,
  status: String
}, { timestamps: true });

module.exports = mongoose.model("CallLog", callLogSchema);
