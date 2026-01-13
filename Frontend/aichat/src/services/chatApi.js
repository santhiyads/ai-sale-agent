// frontend/src/services/chatApi.js

function getSessionId() {
  let sessionId = localStorage.getItem("chat_session_id");

  if (!sessionId) {
    sessionId =
      crypto?.randomUUID?.() ||
      `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    localStorage.setItem("chat_session_id", sessionId);
  }

  return sessionId;
}

export async function sendChatMessage(campaignId, message) {
  const response = await fetch("/chat/message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      session_id: getSessionId(),   // ✅ REQUIRED
      campaign_id: campaignId,
      message
    })
  });

  // 🔥 IMPORTANT: parse JSON
  const data = await response.json();

  return data; // { reply: "AI message" }
}
