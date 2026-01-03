import { useState } from "react";
import AdGridPage from "./pages/AdGridPage";
import AdDemoPage from "./pages/AdDemoPage";

function App() {
  const [selectedAd, setSelectedAd] = useState(null);

  if (!selectedAd) {
    return <AdGridPage onSelectAd={setSelectedAd} />;
  }

  return <AdDemoPage ad={selectedAd} />;
}

export default App;
