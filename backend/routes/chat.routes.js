const express = require("express");
const router = express.Router();

const ChatController = require("../controllers/chat.controller");

// 🔴 TEMP DEBUG (IMPORTANT)
console.log("ChatController:", ChatController);

router.post("/message", ChatController.sendMessage);

module.exports = router;
