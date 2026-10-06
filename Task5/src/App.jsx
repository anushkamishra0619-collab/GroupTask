import { useState } from "react";
import Hero from "./Componenets/Navbar.jsx/hero.jsx";
import ProfilePreview from "./Componenets/Navbar.jsx/ProfilePreview.jsx";

export default function App() {
  const [analyzedUsername, setAnalyzedUsername] = useState("");

  if (analyzedUsername) {
    return (
      <ProfilePreview
        username={analyzedUsername}
        onBack={() => setAnalyzedUsername("")}
      />
    );
  }

  return <Hero onAnalyze={setAnalyzedUsername} />;
}
