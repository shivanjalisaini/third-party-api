const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

exports.sendWhatsApp = async (to, message) => {
  return await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: `whatsapp:${to}`,
    body: message
  });
};

exports.sendSMS = async (to, message) => {
  return await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE,     //if want to send message then you need to purchase twilio number
    to
  });
};
