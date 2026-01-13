import React from "react";
import "../styles/chat.css";

/* ---------- Bold Parser ---------- */
function renderBold(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

/* ---------- Product Parser ---------- */
function parseProducts(text) {
  const cleaned = text.replace(/\s+/g, " ").trim();

  if (!cleaned.includes("Price:") || !cleaned.includes("Description:")) {
    return null;
  }

  const items = cleaned.split(/\d+\)\s*/).filter(Boolean);

  return items.map(item => {
    const name = item.match(/\*\*(.*?)\*\*/)?.[1];
    const price = item.match(/Price:\s*₹?[\d,]+[^-]*/)?.[0];
    const description = item.match(/Description:\s*(.*)/)?.[1];

    return { name, price, description };
  });
}

/* ---------- Message Component ---------- */
export default function Message({ text, isUser, aiName }) {
  if (isUser) {
    return (
      <div className="message-row user">
        <div className="user-msg">{text}</div>
      </div>
    );
  }

  const products = parseProducts(text);

  // ✅ PRODUCT MESSAGE
  if (products) {
    return (
      <div className="message-row ai">
        <div className="ai-msg">
          <div className="ai-label">🤖 {aiName}</div>

          {products.map((p, i) => (
            <div key={i} className="product-card">
              {p.name && <div className="product-title">{p.name}</div>}
              {p.price && <div className="product-price">{p.price}</div>}
              {p.description && (
                <div className="product-desc">{p.description}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ✅ NORMAL AI MESSAGE
  return (
    <div className="message-row ai">
      <div className="ai-msg">
        <div className="ai-label">🤖 {aiName}</div>
        <div className="message-text">{renderBold(text)}</div>
      </div>
    </div>
  );
}
