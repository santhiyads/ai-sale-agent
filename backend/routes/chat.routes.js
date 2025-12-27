const express = require("express");
const router = express.Router();
const ChatController = require("../controllers/chat.controller");

router.post("/start", ChatController.startChat);
router.post("/message", ChatController.sendMessage);
router.post("/complete", ChatController.completeChat);

module.exports = router;
