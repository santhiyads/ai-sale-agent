export default function Avatar({ isTalking }) {
  return (
    <div className="avatar-box">
      <img
        src={isTalking ? "/AI-talking-avatar.gif" : "/ai_not_talk.png"}
        alt="AI Avatar"
        className="avatar-img"
      />
      <p className="avatar-name">AI Sales Assistant</p>
    </div>
  );
}