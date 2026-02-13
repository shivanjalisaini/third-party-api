const router = require("express").Router();

router.get("/health", (req, res) => {
  res.json({
    success: true,
    service: "WebRTC Video Call Server",
    status: "Running"
  });
});

module.exports = router;
