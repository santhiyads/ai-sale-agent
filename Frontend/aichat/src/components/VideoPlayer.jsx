export default function VideoPlayer({ onVideoEnd }) {
  return (
    <video
      src="/demo-ad.mp4"
      autoPlay
      controls
      onEnded={onVideoEnd}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover"
      }}
    />
  );
}
