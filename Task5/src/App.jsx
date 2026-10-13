import { useEffect, useState } from "react";
import Hero from "./Componenets/Navbar.jsx/hero.jsx";
import AnalyzeProfile from "./Componenets/Navbar.jsx/AnalyzeProfile.jsx";
import ProfilePreview from "./Componenets/Navbar.jsx/ProfilePreview.jsx";
import IssueExplorer from "./Componenets/Navbar.jsx/IssueExplorer.jsx";
import TrackContributions from "./Componenets/Navbar.jsx/TrackContributions.jsx";
import { getProfile } from "./services/api.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const VALID_VIEWS = ["hero", "analyze", "preview", "issues", "contributions"];

export default function App() {
  const [view, setView] = useState(() => {
    const savedView = localStorage.getItem("devpath-view");
    return VALID_VIEWS.includes(savedView) ? savedView : "hero";
  });
  const [authenticated, setAuthenticated] = useState(() => Boolean(localStorage.getItem("token")));
  const [visitedViews, setVisitedViews] = useState(() => {
    const savedView = localStorage.getItem("devpath-view");
    const initial = { analyze: true };
    if (savedView && VALID_VIEWS.includes(savedView)) {
      initial[savedView] = true;
    }
    return initial;
  });
  const [githubUsername, setGithubUsername] = useState("");
  const [profileLoadError, setProfileLoadError] = useState(false);

  const changeView = (nextView) => {
    if (!VALID_VIEWS.includes(nextView)) return;
    setView(nextView);
    localStorage.setItem("devpath-view", nextView);
  };

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
      const savedView = localStorage.getItem("devpath-view");
      changeView(savedView && VALID_VIEWS.includes(savedView) ? savedView : "analyze");
      return;
    }
    if (localStorage.getItem("token")) {
      setAuthenticated(true);
      const savedView = localStorage.getItem("devpath-view");
      changeView(savedView && VALID_VIEWS.includes(savedView) ? savedView : "analyze");
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
    localStorage.removeItem("devpath-view");
    setAuthenticated(false);
    setGithubUsername("");
    setProfileLoadError(false);
    setView("hero");
  };
  const handleJourneySelect = (index) => {
    const nextView = ["analyze", "preview", "issues", "contributions"][index];
    if (!nextView) return;

    setVisitedViews((previous) => ({ ...previous, [nextView]: true }));
    changeView(nextView);
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
          onBack={() => changeView("analyze")}
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
