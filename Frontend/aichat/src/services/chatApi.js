const API_BASE = "http://localhost:4000/chat";

export async function sendChatMessage(message) {
  const res = await fetch(`${API_BASE}/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message
    })
  });

  if (!res.ok) {
    throw new Error("Chat API failed");
  }

  return res.json();
}
