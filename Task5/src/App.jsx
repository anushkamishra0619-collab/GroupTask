import { useState } from "react";
import Hero from "./Componenets/Navbar.jsx/hero.jsx";
import AnalyzeProfile from "./Componenets/Navbar.jsx/AnalyzeProfile.jsx";
import ProfilePreview from "./Componenets/Navbar.jsx/ProfilePreview.jsx";
import IssueExplorer from "./Componenets/Navbar.jsx/IssueExplorer.jsx";
import TrackContributions from "./Componenets/Navbar.jsx/TrackContributions.jsx";

export default function App() {
  const [view, setView] = useState("hero");
  const [analyzedUsername, setAnalyzedUsername] = useState("");

  const handleAnalyze = (username) => {
    setAnalyzedUsername(username);
    setView("analyze");
  };

  const returnToHero = () => {
    setView("hero");
    setAnalyzedUsername("");
  };

  const handleJourneySelect = (index) => {
    if (index === 0) setView("analyze");
    if (index === 1) setView("preview");
    if (index === 2) setView("issues");
    if (index === 3) setView("contributions");
  };

  if (view === "analyze") {
    return (
      <AnalyzeProfile
        username={analyzedUsername}
        onJourneySelect={handleJourneySelect}
        onBack={returnToHero}
      />
    );
  }

  if (view === "preview") {
    return (
      <ProfilePreview
        onBack={() => setView("analyze")}
        onLogout={returnToHero}
        onJourneySelect={handleJourneySelect}
      />
    );
  }

  if (view === "issues") {
    return (
      <IssueExplorer
        username={analyzedUsername}
        onJourneySelect={handleJourneySelect}
        onLogout={returnToHero}
      />
    );
  }

  if (view === "contributions") {
    return (
      <TrackContributions
        onJourneySelect={handleJourneySelect}
        onLogout={returnToHero}
      />
    );
  }

  return <Hero onAnalyze={handleAnalyze} />;
}
