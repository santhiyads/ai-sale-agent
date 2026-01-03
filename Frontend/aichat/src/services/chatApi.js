// frontend/src/services/chatApi.js

function getSessionId() {
  let sessionId = localStorage.getItem("chat_session_id");

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("chat_session_id", sessionId);
  }

  return sessionId;
}

export async function sendChatMessage(campaignId, message) {
  const response = await fetch("http://localhost:4000/chat/message", {
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
