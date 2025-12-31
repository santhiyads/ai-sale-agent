export default function VideoPlayer({ src, onEnd }) {
  return (
    <video
      src={src}
      autoPlay
      controls={false}
      onEnded={onEnd}
      style={{
        width: "100vw",
        height: "100vh",
        objectFit: "cover",
        background: "#000"
      }}
    />
  );
}
