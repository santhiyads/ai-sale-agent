export default function Message({ text, isUser }) {
  return (
    <div className={isUser ? "user-msg" : "ai-msg"}>
      {text}
    </div>
  );
}
