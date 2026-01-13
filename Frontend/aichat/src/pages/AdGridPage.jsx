import { ADS } from "../data/ads";

export default function AdGridPage({ onSelectAd }) {
  return (
    <>
      {/* ===== TOP AI BRAND BAR ===== */}
      <div style={topBar}>
        <div style={brandWrap}>
          <img src="/adxreel.png" alt="Adxreel Logo" style={logoStyle} />
          <div>
            <div style={brandText}>Adxreel</div>
            <div style={tagline}>AI Advertising Assistant</div>
          </div>
        </div>
      </div>

      {/* ===== AI NOTE / INSTRUCTION ===== */}
      <div style={noteBox}>
        🤖 <strong>AI Demo Note:</strong> After selecting an advertisement,
        the <strong> Adxreel AI Assistant </strong> will open.
        You can ask questions, get help, and understand the ad instantly.
      </div>

      {/* ===== AD GRID ===== */}
      <div style={gridStyle}>
        {ADS.map((ad) => (
          <div
            key={ad.adId}
            style={cardStyle}
            onClick={() => onSelectAd(ad)}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-8px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <div style={aiGlow} />
            <video
              src={ad.video}
              muted
              loop
              autoPlay
              playsInline
              style={videoStyle}
            />

            <div style={labelStyle}>
              <strong style={companyStyle}>{ad.companyName}</strong>
              <div style={productStyle}>{ad.productName}</div>
              <div style={aiHint}>Ask Adxreel AI about this ad →</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ================= STYLES ================= */

const topBar = {
  position: "sticky",
  top: 0,
  zIndex: 100,
  background: "linear-gradient(90deg, #4f8cff, #7b5cff, #ec4899)",
  padding: "14px 26px",
  borderRadius: "0 0 18px 18px",
  boxShadow: "0 10px 30px rgba(79,140,255,0.35)"
};

const brandWrap = {
  display: "flex",
  alignItems: "center",
  gap: "14px"
};

const logoStyle = {
  height: "36px"
};

const brandText = {
  fontSize: "22px",
  fontWeight: "700",
  letterSpacing: "0.8px",
  color: "#ffffff"
};

const tagline = {
  fontSize: "13px",
  color: "rgba(255,255,255,0.9)"
};

const noteBox = {
  maxWidth: "1100px",
  margin: "22px auto",
  padding: "16px 20px",
  borderRadius: "14px",
  background:
    "linear-gradient(135deg, rgba(79,140,255,0.12), rgba(236,72,153,0.12))",
  color: "#1f2937",
  fontSize: "15px",
  boxShadow: "0 8px 24px rgba(123,92,255,0.15)",
  border: "1px solid rgba(123,92,255,0.25)"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "28px",
  padding: "24px",
  maxWidth: "1200px",
  margin: "0 auto"
};

const cardStyle = {
  position: "relative",
  cursor: "pointer",
  borderRadius: "18px",
  overflow: "hidden",
  background: "#000",
  boxShadow: "0 16px 40px rgba(0,0,0,0.2)",
  transition: "all 0.35s ease"
};

const aiGlow = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(120deg, rgba(79,140,255,0.25), rgba(236,72,153,0.15), transparent)",
  pointerEvents: "none"
};

const videoStyle = {
  width: "100%",
  height: "210px",
  objectFit: "cover",
  display: "block"
};

const labelStyle = {
  padding: "16px",
  background: "#ffffff"
};

const companyStyle = {
  fontSize: "16px",
  display: "block",
  marginBottom: "4px"
};

const productStyle = {
  fontSize: "14px",
  color: "#555"
};

const aiHint = {
  marginTop: "8px",
  fontSize: "13px",
  fontWeight: "600",
  background: "linear-gradient(90deg, #4f8cff, #ec4899)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent"
};