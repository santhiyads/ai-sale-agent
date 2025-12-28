import { useState } from "react";
import VideoPlayer from "../components/VideoPlayer";
import ChatBubble from "../components/ChatBubble";

export default function AdDemoPage() {
  const [showChat, setShowChat] = useState(false);

  return (
    <div style={styles.container}>
      <VideoPlayer onVideoEnd={() => setShowChat(true)} />

      {showChat && <ChatBubble />}
    </div>
  );
}

const styles = {
  container: {
    position: "relative",
    height: "100vh",
    backgroundColor: "#000"
  }
};
