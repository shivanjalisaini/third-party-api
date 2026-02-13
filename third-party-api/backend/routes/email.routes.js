const router = require("express").Router();
const { sendMail } = require("../controllers/email.controller");


router.post("/send", sendMail);


module.exports = router;