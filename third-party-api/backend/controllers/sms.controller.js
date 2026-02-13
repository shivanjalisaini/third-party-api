const { sendSMS } = require("../services/twilio.service");
const SmsLog = require("../models/SmsLog");

exports.sendSms = async (req, res) => {
  try {
    const { to, message } = req.body;

    const response = await sendSMS(to, message);

    await SmsLog.create({
      phone: to,
      message,
      sid: response.sid
    });

    res.json({
      success: true,
      sid: response.sid
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
