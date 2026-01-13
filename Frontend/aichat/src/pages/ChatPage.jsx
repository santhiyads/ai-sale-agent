import { useEffect, useState, useRef } from "react";
import { sendChatMessage } from "../services/chatApi";
import { speakWithZiraSweet } from "../utils/speak";
import "../styles/chat.css";

export default function ChatPage({ campaignId, companyName, productName }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [isTalking, setIsTalking] = useState(false);

  const endRef = useRef(null);

  /* ================= INIT MESSAGE ================= */
  useEffect(() => {
    setMessages([
      {
        text: `👋 Hi! I’m the ADXREEL AI Assistant.
After you add an ad, I’ll open automatically and help clear all your doubts about ${productName}.`,
        isUser: false
      }
    ]);
  }, [productName]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  /* ================= SEND MESSAGE ================= */
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

      setIsTalking(true);
      speakWithZiraSweet(res.reply, () => setIsTalking(false));

    } catch (err) {
      setTyping(false);
      setIsTalking(false);
      setMessages(prev => [
        ...prev,
        { text: "⚠️ Something went wrong. Please try again.", isUser: false }
      ]);
    }
  }

  return (
    <div className="chat-container">

      {/* ================= FORCE ADXREEL HEADER (ALWAYS VISIBLE) ================= */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999999,
          background: "linear-gradient(90deg, #4f8cff, #7b5cff, #ec4899)",
          padding: "14px 22px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.25)"
        }}
      >
        <img
          src="/adxreel.png"
          alt="ADXREEL Logo"
          style={{ height: "36px" }}
        />
        <div>
          <div style={{ fontSize: "20px", fontWeight: 700, color: "#fff" }}>
            ADXREEL
          </div>
          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.9)" }}>
            AI Advertising Assistant
          </div>
        </div>
      </div>

      {/* ================= COMPANY HEADER ================= */}
      <div className="chat-header" style={{ marginTop: "80px" }}>
        <div>
          <strong>{companyName}</strong>
          <div className="chat-subtitle">{productName}</div>
        </div>
        <span className="verified">✔ Verified</span>
      </div>

      {/* ================= AVATAR ================= */}
      <div className="ai-avatar">
        <img
          src={isTalking ? "/AI-talking-avatar.gif" : "/ai_not_talk.png"}
          alt="AI Avatar"
        />
      </div>

      {/* ================= MESSAGES ================= */}
      <div className="messages">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`message ${m.isUser ? "user-msg" : "ai-msg"}`}
          >
            {m.text}
          </div>
        ))}

        {typing && <div className="typing">AI is typing…</div>}
        <div ref={endRef} />
      </div>

      {/* ================= INPUT ================= */}
      <div className="input-bar">
        <input
          value={input}
          onChange={e => {
            setInput(e.target.value);
            window.speechSynthesis.cancel();
          }}
          placeholder="Ask about ads, pricing, offers..."
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

    </div>
  );
}