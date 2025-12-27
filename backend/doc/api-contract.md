# AI Chat API Contracts

## POST /chat/start
Start chat for a campaign.

Request:
{
  "campaign_id": number
}

Response:
{
  "chat_id": string,
  "state": "GREETING",
  "message": string
}

---

## POST /chat/message
Send user message.

Request:
{
  "chat_id": string,
  "message": string
}

Response:
{
  "state": string,
  "message": string
}

---

## POST /chat/complete
Complete chat session.

Request:
{
  "chat_id": string
}

Response:
{
  "status": "completed"
}
