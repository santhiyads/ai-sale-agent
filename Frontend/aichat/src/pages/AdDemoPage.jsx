import { useState } from "react";
import VideoPlayer from "../components/VideoPlayer";
import ChatBubble from "../components/ChatBubble";

export default function AdDemoPage({ ad }) {
  const [videoEnded, setVideoEnded] = useState(false);

  return (
    <>
      {!videoEnded ? (
        <VideoPlayer
          src={ad.video}
          onEnd={() => setVideoEnded(true)}
        />
      ) : (
        <ChatBubble
          campaignId={ad.campaignId}
          companyName={ad.companyName}
          productName={ad.productName}
        />
      )}
    </>
  );
}
