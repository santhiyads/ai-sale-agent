import { useEffect, useState } from "react";
import { sendChatMessage } from "../services/chatApi";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator";

export default function ChatBubble({
  campaignId,
  companyName,
  productName
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  // 🔹 Initial AI greeting (runs once)
  useEffect(() => {
    setMessages([
      {
        text: `👋 Hi! I’m the AI assistant for ${productName} by ${companyName}.
I can help you with price, features, warranty, and offers.

👉 What would you like to know?`,
        isUser: false
      }
    ]);
  }, [companyName, productName]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { text: input, isUser: true }]);
    const userInput = input;
    setInput("");
    setTyping(true);

    try {
      const res = await sendChatMessage(campaignId, userInput);

      // ✅ ALWAYS TRUST BACKEND REPLY
      setMessages(prev => [
        ...prev,
        { text: res.reply, isUser: false }
      ]);

    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          text: "⚠️ Something went wrong. Please try again.",
          isUser: false
        }
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <div>
          <strong>{companyName}</strong>
          <div className="chat-subtitle">{productName}</div>
        </div>
        <span className="verified">✔ Verified</span>
      </div>

      {/* Messages */}
      <div className="chat-box">
        <div className="messages">
          {messages.map((m, i) => (
            <Message key={i} text={m.text} isUser={m.isUser} />
          ))}
          {typing && <TypingIndicator />}
        </div>

        {/* Input */}
        <div className="input-bar">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about price, warranty, size..."
            onKeyDown={e => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}
