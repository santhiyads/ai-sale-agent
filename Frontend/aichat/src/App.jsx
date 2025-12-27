import { useEffect } from "react";

function App() {

  useEffect(() => {
    console.log("✅ Frontend loaded");

    fetch("http://localhost:4000/mock/campaign")
      .then(res => res.json())
      .then(data => console.log("📢 CAMPAIGN:", data))
      .catch(err => console.error("❌ Campaign error", err));

    fetch("http://localhost:4000/mock/company")
      .then(res => res.json())
      .then(data => console.log("🏢 COMPANY:", data))
      .catch(err => console.error("❌ Company error", err));

    fetch("http://localhost:4000/mock/products")
      .then(res => res.json())
      .then(data => console.log("📦 PRODUCTS:", data))
      .catch(err => console.error("❌ Products error", err));

  }, []);

  return (
    <div>
      <h3>Milestone-2 Frontend Test</h3>
      <p>Open browser console (F12)</p>
    </div>
  );
}

export default App;
