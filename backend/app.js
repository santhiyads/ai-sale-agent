const express = require("express");
const cors = require("cors");
const chatRoutes = require("./routes/chat.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/chat", chatRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "AI Chat Prototype" });
});

module.exports = app;
