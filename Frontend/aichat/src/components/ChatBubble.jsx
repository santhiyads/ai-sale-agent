import { useState } from "react";
import { sendChatMessage } from "../services/chatApi";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator";

export default function ChatBubble({
  campaignId,
  companyName,
  productName,
  onBack
}) {
  const [messages, setMessages] = useState([
    {
      text: `👋 Hi! I’m the AI assistant for ${productName} by ${companyName}. What would you like to know?`,
      isUser: false
    }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { text: input, isUser: true }]);
    setInput("");
    setTyping(true);

    console.log("SENDING:", { campaignId, message: input });

    const res = await sendChatMessage(campaignId, input);

    setTyping(false);
    setMessages(prev => [...prev, { text: res.reply, isUser: false }]);
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div>
          <strong>{companyName}</strong>
          <div className="chat-subtitle">{productName}</div>
          <span className="verified">✔ Verified</span>
        </div>
        <button onClick={onBack}>⬅ Back</button>
      </div>

      <div className="chat-box">
        <div className="messages">
          {messages.map((m, i) => (
            <Message key={i} {...m} />
          ))}
          {typing && <TypingIndicator />}
        </div>

        <div className="input-bar">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about price, warranty, offers..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}
