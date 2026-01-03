export default function Message({ text, isUser }) {
  return (
    <div className={`message ${isUser ? "user-msg" : "ai-msg"}`}>
      {text}
    </div>
  );
}
