const { sendEmail } = require("../services/email.service");
const EmailLog = require("../models/EmailLog");


exports.sendMail = async (req, res) => {
try {
const { to, subject, html } = req.body;


if (!to || !subject || !html) {
return res.status(400).json({ message: "Missing required fields" });
}


const response = await sendEmail({ to, subject, html });


await EmailLog.create({ to, subject, body: html });


res.json({
success: true,
message: "Email sent successfully",
messageId: response.messageId
});


} catch (err) {
console.error("Email Error:", err);
res.status(500).json({ error: err.message });
}
};