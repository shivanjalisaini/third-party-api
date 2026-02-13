const router = require("express").Router();
const { sendWhatsApp } = require("../services/twilio.service");

router.post("/send", async (req, res) => {
  try {
    const { to, message } = req.body;

    const result = await sendWhatsApp(to, message);

    res.json({ success: true, sid: result.sid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
