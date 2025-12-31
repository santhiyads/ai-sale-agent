const express = require("express");
const cors = require("cors");
const chatRoutes = require("./routes/chat.routes");
//const mockRoutes = require("./routes/mock.routes");


const app = express();

app.use(cors());
app.use(express.json());
app.use("/chat", chatRoutes);
// app.use("/mock", mockRoutes);
console.log("TYPE OF mockRoutes:", typeof mockRoutes);
//console.log("mockRoutes value:", mockRoutes);
app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "AI Chat Prototype" });
});

module.exports = app;
