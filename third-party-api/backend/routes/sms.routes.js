const router = require("express").Router();
const { sendSms } = require("../controllers/sms.controller");

router.post("/send", sendSms);

module.exports = router;
