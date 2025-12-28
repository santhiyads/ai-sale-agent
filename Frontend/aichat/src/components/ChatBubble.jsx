import { useState } from "react";
import { sendChatMessage } from "../services/chatApi";

export default function ChatBubble() {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "👋 Hi! Want to know more about this product?"
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await sendChatMessage(input);

      setMessages(prev => [
        ...prev,
        { role: "ai", text: response.reply }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: "ai", text: "⚠️ Something went wrong. Please try again." }
      ]);
    }

    setLoading(false);
  }

  return (
    <div style={styles.chatBubble}>
      <div style={styles.header}>AI Assistant</div>

      <div style={styles.messages}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={
              msg.role === "user"
                ? styles.userMessage
                : styles.aiMessage
            }
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div style={styles.inputRow}>
        <input
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          style={styles.input}
          onKeyDown={e => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} style={styles.sendBtn}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  chatBubble: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "45%",
    backgroundColor: "#fff",
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px",
    boxShadow: "0 -4px 20px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column"
  },
  header: {
    padding: "12px",
    fontWeight: "bold",
    borderBottom: "1px solid #eee"
  },
  messages: {
    flex: 1,
    padding: "12px",
    overflowY: "auto"
  },
  aiMessage: {
    backgroundColor: "#f1f1f1",
    padding: "10px",
    borderRadius: "12px",
    marginBottom: "8px",
    maxWidth: "80%"
  },
  userMessage: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px",
    borderRadius: "12px",
    marginBottom: "8px",
    marginLeft: "auto",
    maxWidth: "80%"
  },
  inputRow: {
    display: "flex",
    borderTop: "1px solid #eee"
  },
  input: {
    flex: 1,
    padding: "12px",
    border: "none",
    outline: "none"
  },
  sendBtn: {
    padding: "0 16px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer"
  }
};
