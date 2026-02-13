const { makeCall } = require("../services/call.service");
const CallLog = require("../models/CallLog");

exports.makeVoiceCall = async (req, res) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({ error: "to and message are required" });
    }

    const call = await makeCall(to, message);

    await CallLog.create({
      to,
      message,
      status: call.status
    });

    res.json({
      success: true,
      sid: call.sid,
      status: call.status
    });

  } catch (err) {
    console.error("Call Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
