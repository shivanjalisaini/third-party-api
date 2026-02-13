const router = require("express").Router();
const { makeVoiceCall } = require("../controllers/call.controller");

router.post("/make", makeVoiceCall);

module.exports = router;
