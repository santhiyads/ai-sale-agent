import axios from "axios";

const DID_API_KEY = process.env.DID_API_KEY;

// ✅ HARD-CODED, VALID PRESENTER IDS
const AVATAR_MAP = {
  female: "amber_v3",
  male: "adam_v3"
};

const VOICE_MAP = {
  female: "en-US-JennyNeural",
  male: "en-US-GuyNeural"
};

export async function createAvatarTalk(text, gender = "female") {
  const response = await axios.post(
    "https://api.d-id.com/talks",
    {
      presenter_id: AVATAR_MAP[gender],
      script: {
        type: "text",
        input: text,
        provider: {
          type: "microsoft",
          voice_id: VOICE_MAP[gender]
        }
      }
    },
    {
      headers: {
        Authorization: `Basic ${DID_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data.id; // talk_id
}

export async function getAvatarTalkStatus(talkId) {
  const response = await axios.get(
    `https://api.d-id.com/talks/${talkId}`,
    {
      headers: {
        Authorization: `Basic ${DID_API_KEY}`
      }
    }
  );

  return response.data;
}
