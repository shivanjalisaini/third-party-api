const { sendWhatsapp } = require("../services/twilio.service");
const WhatsappLog = require("../models/WhatsappLog");

exports.sendWhatsappMsg = async (req, res) => {
  try {
    const { phone, message } = req.body;
    await sendWhatsapp(phone, message);
    await WhatsappLog.create({ phone, message });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
