import { useEffect, useState, useRef } from "react";
import { sendChatMessage } from "../services/chatApi";
import { speak } from "../utils/speak";
import "../styles/chat.css";

export default function ChatBubble({
  campaignId,
  companyName,
  productName,
  logo
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [isTalking, setIsTalking] = useState(false);

  const endRef = useRef(null);

  /* ===== INIT MESSAGE ===== */
  useEffect(() => {
    setMessages([
      {
        text: `👋 Hi! I’m the AI assistant for ${productName} by ${companyName}.
I can help you with price, features, and current offers.`,
        isUser: false
      }
    ]);
  }, [companyName, productName]);

  /* ===== AUTO SCROLL ===== */
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  /* ===== SEND MESSAGE ===== */
  async function sendMessage() {
    if (!input.trim()) return;

    const userText = input;
    window.speechSynthesis.cancel();

    setMessages(prev => [...prev, { text: userText, isUser: true }]);
    setInput("");
    setTyping(true);

    try {
      const res = await sendChatMessage(campaignId, userText);

      setTyping(false);
      setMessages(prev => [...prev, { text: res.reply, isUser: false }]);

      setTimeout(() => {
        setIsTalking(true);
        speak(res.reply, () => setIsTalking(false));
      }, 400);

    } catch (err) {
      setTyping(false);
      setIsTalking(true);
      setMessages(prev => [
        ...prev,
        { text: "⚠️ Something went wrong. Please try again.", isUser: false }
      ]);
    }
  }

  return (
    <div className="chat-container">

      {/* ===== HEADER WITH LOGO ===== */}
      <div className="chat-header">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          
          {logo && (
            <img
              src={logo}
              alt={companyName}
              style={{
                height: "36px",
                width: "36px",
                objectFit: "contain",
                borderRadius: "6px"
              }}
            />
          )}

          <div>
            <strong>{companyName}</strong>
            <div className="chat-subtitle">{productName}</div>
          </div>
        </div>

        <span className="verified">✔ Verified</span>
      </div>

      {/* ===== AVATAR ===== */}
      <div className="ai-avatar">
        <img
          src={isTalking ? "/AI-talking-avatar.gif" : "/ai_not_talk.png"}
          alt="AI Avatar"
        />
      </div>

      {/* ===== MESSAGES ===== */}
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={`message-row ${m.isUser ? "user" : "ai"}`}>
            <div className={m.isUser ? "user-msg" : "ai-msg"}>
              {m.text}
            </div>
          </div>
        ))}

        {typing && <div className="typing">AI is typing…</div>}
        <div ref={endRef} />
      </div>

      {/* ===== INPUT ===== */}
      <div className="input-bar">
        <input
          value={input}
          onChange={e => {
            setInput(e.target.value);
            window.speechSynthesis.cancel();
          }}
          placeholder="Ask about price, offers..."
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}