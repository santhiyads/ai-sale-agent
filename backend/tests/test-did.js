import axios from "axios";
import "dotenv/config";

const DID_API_KEY = process.env.DID_API_KEY;

async function testDidAvatar() {
  try {
    const response = await axios.post(
      "https://api.d-id.com/talks",
      {
        presenter_id: "amber_v3",
        script: {
          type: "text",
          input: "Hello, this is a test avatar speaking.",
          provider: {
            type: "microsoft",
            voice_id: "en-US-JennyNeural"
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

    console.log("✅ TALK CREATED");
    console.log("Talk ID:", response.data.id);

    return response.data.id;

  } catch (err) {
    console.error("❌ D-ID ERROR");
    console.error(err.response?.data || err.message);
  }
}

async function pollVideo(talkId) {
  while (true) {
    const res = await axios.get(
      `https://api.d-id.com/talks/${talkId}`,
      {
        headers: {
          Authorization: `Basic ${DID_API_KEY}`
        }
      }
    );

    if (res.data.status === "done") {
      console.log("🎉 VIDEO READY");
      console.log(res.data.result_url);
      break;
    }

    console.log("⏳ Processing...");
    await new Promise(r => setTimeout(r, 2000));
  }
}

testDidAvatar().then(talkId => {
  if (talkId) pollVideo(talkId);
});
