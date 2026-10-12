import { useEffect, useState } from "react";
import Hero from "./Componenets/Navbar.jsx/hero.jsx";
import AnalyzeProfile from "./Componenets/Navbar.jsx/AnalyzeProfile.jsx";
import ProfilePreview from "./Componenets/Navbar.jsx/ProfilePreview.jsx";
import IssueExplorer from "./Componenets/Navbar.jsx/IssueExplorer.jsx";
import TrackContributions from "./Componenets/Navbar.jsx/TrackContributions.jsx";
import { getProfile } from "./services/api.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [view, setView] = useState("hero");
  const [authenticated, setAuthenticated] = useState(false);
  const [visitedViews, setVisitedViews] = useState({ analyze: true });
  const [githubUsername, setGithubUsername] = useState("");
  const [profileLoadError, setProfileLoadError] = useState(false);

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

  useEffect(() => {
    if (!authenticated) return undefined;

    let active = true;
    getProfile()
      .then((response) => {
        if (!active) return;
        const profile = response?.data ?? response?.profile ?? response;
        const username = profile?.username || profile?.login;
        if (username) {
          setGithubUsername(username);
          setProfileLoadError(false);
        } else {
          setProfileLoadError(true);
        }
      })
      .catch(() => {
        if (active) setProfileLoadError(true);
      });

    return () => {
      active = false;
    };
  }, [authenticated]);

  const loginWithGitHub = () => {
    window.location.href = `${API_URL}/api/auth/github`;
  };
  const logout = () => {
    localStorage.removeItem("token");
    setAuthenticated(false);
    setGithubUsername("");
    setProfileLoadError(false);
    setView("hero");
  };
  const handleJourneySelect = (index) => {
    const nextView = ["analyze", "preview", "issues", "contributions"][index];
    if (!nextView) return;

    setVisitedViews((previous) => ({ ...previous, [nextView]: true }));
    setView(nextView);
  };

  if (!authenticated) return <Hero onAnalyze={loginWithGitHub} />;

  const renderVisitedView = (name, content) =>
    visitedViews[name] && (
      <div key={name} style={{ display: view === name ? "block" : "none" }}>
        {content}
      </div>
    );

  return (
    <>
      {renderVisitedView(
        "analyze",
        <AnalyzeProfile onJourneySelect={handleJourneySelect} onBack={logout} />,
      )}
      {renderVisitedView(
        "preview",
        <ProfilePreview
          onBack={() => setView("analyze")}
          onLogout={logout}
          onJourneySelect={handleJourneySelect}
        />,
      )}
      {renderVisitedView(
        "issues",
        <IssueExplorer
          username={githubUsername || (profileLoadError ? "Profile unavailable" : "Loading profile…")}
          onJourneySelect={handleJourneySelect}
          onLogout={logout}
        />,
      )}
      {renderVisitedView(
        "contributions",
        <TrackContributions
          username={githubUsername || (profileLoadError ? "Profile unavailable" : "Loading profile…")}
          onJourneySelect={handleJourneySelect}
          onLogout={logout}
        />,
      )}
    </>
  );
}
