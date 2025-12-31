import { useState } from "react";
import { ADS } from "../data/ads";
import VideoPlayer from "../components/VideoPlayer";
import ChatBubble from "../components/ChatBubble";

export default function AdDemoPage() {
  const [selectedAd, setSelectedAd] = useState(null);
  const [videoEnded, setVideoEnded] = useState(false);

  // 👉 STEP 1: SHOW 3 ADS GRID
  if (!selectedAd) {
    return (
      <div style={gridStyle}>
        {ADS.map(ad => (
          <div
            key={ad.adId}
            style={cardStyle}
            onClick={() => setSelectedAd(ad)}
          >
            <video
              src={ad.video}
              muted
              playsInline
              preload="metadata"
              style={videoThumbStyle}
            />
            <div style={infoStyle}>
              <h3>{ad.companyName}</h3>
              <p>{ad.productName}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 👉 STEP 2: PLAY VIDEO
  if (!videoEnded) {
    return (
      <VideoPlayer
        src={selectedAd.video}
        onEnd={() => setVideoEnded(true)}
      />
    );
  }

  // 👉 STEP 3: CHAT
  return (
    <ChatBubble
      campaignId={selectedAd.campaignId}
      companyName={selectedAd.companyName}
      productName={selectedAd.productName}
      onBack={() => {
        setSelectedAd(null);
        setVideoEnded(false);
      }}
    />
  );
}

/* ================= STYLES ================= */

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "24px",
  padding: "32px"
};

const cardStyle = {
  cursor: "pointer",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
  background: "#fff"
};

const videoThumbStyle = {
  width: "100%",
  height: "220px",
  objectFit: "cover",
  background: "#000"
};

const infoStyle = {
  padding: "14px"
};
