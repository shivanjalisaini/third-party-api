const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

exports.makeCall = async (to, message) => {
  return await client.calls.create({
    twiml: `<Response><Say voice="alice">${message}</Say></Response>`,
    to,
    from: process.env.TWILIO_PHONE
  });
};
