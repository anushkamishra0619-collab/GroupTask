import { useEffect, useState } from "react";
import Hero from "./Componenets/Navbar.jsx/hero.jsx";
import AnalyzeProfile from "./Componenets/Navbar.jsx/AnalyzeProfile.jsx";
import ProfilePreview from "./Componenets/Navbar.jsx/ProfilePreview.jsx";
import IssueExplorer from "./Componenets/Navbar.jsx/IssueExplorer.jsx";
import TrackContributions from "./Componenets/Navbar.jsx/TrackContributions.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [view, setView] = useState("hero");
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authError = params.get("authError");
    if (authError) {
      window.history.replaceState({}, document.title, window.location.pathname);
      window.alert(authError);
      return;
    }
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, document.title, window.location.pathname);
      setAuthenticated(true);
      setView("analyze");
      return;
    }
    if (localStorage.getItem("token")) {
      setAuthenticated(true);
      setView("analyze");
    }
  }, []);

  const loginWithGitHub = () => {
    window.location.href = `${API_URL}/api/auth/github`;
  };
  const logout = () => {
    localStorage.removeItem("token");
    setAuthenticated(false);
    setView("hero");
  };
  const handleJourneySelect = (index) => {
    if (index === 0) setView("analyze");
    if (index === 1) setView("preview");
    if (index === 2) setView("issues");
    if (index === 3) setView("contributions");
  };

  if (!authenticated) return <Hero onAnalyze={loginWithGitHub} />;
  if (view === "analyze") return <AnalyzeProfile onJourneySelect={handleJourneySelect} onBack={logout} />;
  if (view === "preview") return <ProfilePreview onBack={() => setView("analyze")} onLogout={logout} onJourneySelect={handleJourneySelect} />;
  if (view === "issues") return <IssueExplorer onJourneySelect={handleJourneySelect} onLogout={logout} />;
  if (view === "contributions") return <TrackContributions onJourneySelect={handleJourneySelect} onLogout={logout} />;
  return <Hero onAnalyze={loginWithGitHub} />;
}
