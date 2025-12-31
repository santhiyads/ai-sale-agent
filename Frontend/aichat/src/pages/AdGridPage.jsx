import { ADS } from "../data/ads";

export default function AdGridPage({ onSelectAd }) {
  return (
    <div style={gridStyle}>
      {ADS.map((ad) => (
        <div
          key={ad.adId}
          style={cardStyle}
          onClick={() => onSelectAd(ad)}
        >
          <video
            src={ad.video}
            muted
            loop
            autoPlay
            style={videoStyle}
          />
          <div style={labelStyle}>
            <strong>{ad.companyName}</strong>
            <div>{ad.productName}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---- styles ---- */
const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "16px",
  padding: "16px"
};

const cardStyle = {
  cursor: "pointer",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
};

const videoStyle = {
  width: "100%",
  height: "200px",
  objectFit: "cover"
};

const labelStyle = {
  padding: "8px",
  background: "#fff"
};
