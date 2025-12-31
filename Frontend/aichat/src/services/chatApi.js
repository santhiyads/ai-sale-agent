export async function sendChatMessage(campaignId, message) {
  console.log("API CALL →", campaignId);

  const res = await fetch("http://localhost:4000/chat/message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      campaign_id: campaignId,
      message
    })
  });

  return res.json();
}
