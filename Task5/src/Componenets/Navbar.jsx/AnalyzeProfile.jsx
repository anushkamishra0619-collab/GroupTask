import { useEffect, useMemo, useState } from "react";
import JourneySidebar from "./JourneySidebar";
import { getProfile, getRepositories, syncRepositories } from "../../services/api.js";
import "./AnalyzeProfile.css";

export default function AnalyzeProfile({ onJourneySelect, onBack }) {
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true); setError("");
        const profileResponse = await getProfile();
        if (!active) return;
        const currentProfile = profileResponse?.data ?? profileResponse?.profile ?? profileResponse;
        setProfile(currentProfile);
        const reposResponse = await getRepositories();
        if (!active) return;
        const currentRepos = reposResponse?.data ?? reposResponse?.repositories ?? reposResponse;
        setRepos(Array.isArray(currentRepos) ? currentRepos : []);
        if (!currentProfile?.skills?.length) {
          setAnalyzing(true);
          try { await syncRepositories(); }
          finally { if (active) setAnalyzing(false); }
          const [updatedProfileResponse, updatedReposResponse] = await Promise.all([getProfile(), getRepositories()]);
          if (!active) return;
          const updatedProfile = updatedProfileResponse?.data ?? updatedProfileResponse?.profile ?? updatedProfileResponse;
          const updatedRepos = updatedReposResponse?.data ?? updatedReposResponse?.repositories ?? updatedReposResponse;
          setProfile(updatedProfile);
          setRepos(Array.isArray(updatedRepos) ? updatedRepos : []);
        }
      } catch (e) { if (active) setError(e.message || "Unable to load your GitHub profile."); }
      finally { if (active) setLoading(false); }
    }
    load();
    return () => { active = false; };
  }, []);

  const languages = useMemo(() => {
    const counts = {};
    repos.forEach((repo) => {
      const lang = repo.language;
      if (lang) counts[lang] = (counts[lang] || 0) + 1;
      Object.keys(repo.languages || {}).forEach((name) => { counts[name] = (counts[name] || 0) + 1; });
    });
    return Object.entries(counts).sort((a,b) => b[1]-a[1]);
  }, [repos]);
  const username = profile?.username || profile?.login || "GitHub user";
  const displayName = profile?.name || username;
  const publicRepos = profile?.publicRepos ?? profile?.public_repos ?? repos.length;
  const profileUrl = profile?.profileUrl || profile?.html_url || `https://github.com/${username}`;
  const skills = Array.isArray(profile?.skills) ? profile.skills : [];

  return <div className="analyze-page-layout">
    <JourneySidebar activeStep={0} onSelect={onJourneySelect} onLogout={onBack} />
    <main className="main analyze-profile">
      <div className="analysis-breadcrumb"><span>DevPath</span><span>/</span><span>Profile Analysis</span></div>
      <div className="header-line" />
      <div className="profile-heading">
        <div className="analysis-badge"><span className="badge-dot" />{loading ? "Loading profile" : analyzing ? "Analysis in progress" : "GitHub connected"}</div>
        <h1>We are building your starting point.</h1>
        <p>Your GitHub account details and repository insights, fetched through DevPath.</p>
      </div>
      {loading && <p role="status">Fetching your profile and repositories from the backend…</p>}
      {error && <div className="profile-message profile-error" role="alert"><strong>Could not load your GitHub data</strong><p>{error}</p><button type="button" className="cta" onClick={() => window.location.reload()}>Try again</button></div>}
      {!loading && !error && profile && <>
        <section className="user-profile-card">
          <div className="user-details">
            {profile.avatar || profile.avatarUrl ? <img className="user-avatar" src={profile.avatar || profile.avatarUrl} alt={`${displayName}'s avatar`} /> : <div className="user-avatar">{username.charAt(0).toUpperCase()}</div>}
            <div><h3>{displayName}</h3><p><a href={profileUrl} target="_blank" rel="noreferrer">@{username} · View GitHub profile</a></p>{profile.email && <p>{profile.email}</p>}{profile.bio && <p>{profile.bio}</p>}</div>
          </div>
          <div className="profile-stat"><span>REPOSITORIES</span><strong>{publicRepos}</strong><small>public / accessible</small></div>
          <div className="profile-stat"><span>FOLLOWERS</span><strong>{profile.followers ?? "—"}</strong><small>on GitHub</small></div>
          <div className="profile-stat"><span>FOLLOWING</span><strong>{profile.following ?? "—"}</strong><small>accounts</small></div>
          <div className="profile-stat"><span>LANGUAGES</span><strong>{languages.length}</strong><small>detected in repositories</small></div>
        </section>
        <div className="analysis-grid">
          <section className="signal-card"><div className="card-header"><h2>PROFILE SIGNAL</h2><p>Data received from your connected GitHub account.</p></div>
            <div className="checking-area">
              <div className="checking-item"><div className="analysis-check-icon completed">✓</div><div className="step-content"><h4>GitHub account</h4><p>{displayName} (@{username})</p></div><span className="status done">CONNECTED</span></div>
              <div className="checking-item"><div className="analysis-check-icon completed">✓</div><div className="step-content"><h4>Repositories fetched</h4><p>{repos.length} repositories returned by the backend</p></div><span className="status done">{repos.length} FOUND</span></div>
              <div className="checking-item"><div className="analysis-check-icon completed">✓</div><div className="step-content"><h4>Skills extracted</h4><p>{skills.length ? skills.slice(0, 8).map(s => typeof s === "string" ? s : s.name).filter(Boolean).join(", ") : analyzing ? "Skills are being analyzed…" : "No analyzed skills returned yet"}</p></div><span className="status progress">{analyzing ? "ANALYZING" : skills.length ? `${skills.length} SKILLS` : "PENDING"}</span></div>
            </div>
          </section>
          <section className="note-card"><div className="note-border"/><span className="note-label">YOUR CONNECTED PROFILE</span><h2>{displayName}</h2><p>{profile.bio || "No GitHub bio was provided."}</p><div className="note-divider"/><h4>ACCOUNT DETAILS</h4><ul><li><span>✓</span> Username: @{username}</li><li><span>✓</span> Followers: {profile.followers ?? "—"}</li><li><span>✓</span> Public repositories: {publicRepos}</li></ul></section>
        </div>
        <div className="bottom-grid">
          <section className="languages-card"><div className="section-heading"><h2>LANGUAGES DETECTED</h2><span>repository data</span></div>
            {languages.length ? <div className="language-list">{languages.slice(0, 8).map(([name, count]) => <div key={name}><span className="dot ts"/>{name}<b>{count} {count === 1 ? "repo" : "repos"}</b></div>)}</div> : <p className="reading-text">No language information was returned for these repositories.</p>}
          </section>
          <section className="activity-card"><div className="section-heading"><h2>ACTIVITY LOG</h2><span>{analyzing ? "analyzing" : "connected"}</span></div><div className="activity-list"><p><b>✓</b> Authenticated with GitHub through DevPath backend</p><p><b>✓</b> Loaded profile credentials from backend</p><p><b>✓</b> Loaded {repos.length} repositories</p><p><b>•</b> {analyzing ? "Analyzing repository skills…" : skills.length ? `Received ${skills.length} skills from backend` : "Skill analysis will appear when available"}</p></div><button className="cta" type="button" onClick={() => onJourneySelect?.(1)}>View profile insights</button></section>
        </div>
      </>}
    </main>
  </div>;
}
