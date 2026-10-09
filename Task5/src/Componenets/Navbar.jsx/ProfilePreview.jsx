import { useEffect, useRef, useState } from "react";
import JourneySidebar from "./JourneySidebar";
import journey from "./journey";
import { getProfile, getRepositories } from "../../services/api.js";
import "./ProfileSkills.css";

async function fetchBackendGitHubData() {
  const [profileResponse, reposResponse] = await Promise.all([getProfile(), getRepositories()]);
  const rawProfile = profileResponse?.data ?? profileResponse?.profile ?? profileResponse;
  const rawRepos = reposResponse?.data ?? reposResponse?.repositories ?? reposResponse;
  const profile = {
    ...rawProfile,
    login: rawProfile?.username || rawProfile?.login,
    html_url: rawProfile?.profileUrl || rawProfile?.html_url,
    public_repos: rawProfile?.publicRepos ?? rawProfile?.public_repos,
    avatar_url: rawProfile?.avatar || rawProfile?.avatarUrl || rawProfile?.avatar_url,
  };
  const repos = (Array.isArray(rawRepos) ? rawRepos : []).map((repo) => ({
    ...repo,
    id: repo.id || repo.githubId || repo._id,
    html_url: repo.url || repo.html_url,
    stargazers_count: repo.stars ?? repo.stargazers_count ?? 0,
    updated_at: repo.updatedAt || repo.updated_at,
  }));
  return { user: profile, repos };
}

export default function ProfilePreview({
  username = "",
  onBack,
  onLogout = onBack,
  onJourneySelect,
}) {
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeJourney, setActiveJourney] = useState(1);
  const [retryCount, setRetryCount] = useState(0);
  const [showRepositories, setShowRepositories] = useState(false);
  const sectionRefs = useRef({});

  useEffect(() => {
    let isCurrentRequest = true;

    fetchBackendGitHubData()
      .then(({ user, repos: userRepos }) => {
        if (isCurrentRequest) {
          setProfile(user);
          setRepos(userRepos);
        }
      })
      .catch((fetchError) => {
        if (isCurrentRequest) {
          setError(fetchError.message);
        }
      })
      .finally(() => {
        if (isCurrentRequest) setLoading(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [retryCount]);

  const languages = repos.reduce((counts, repo) => {
    if (repo.language) {
      counts[repo.language] = (counts[repo.language] || 0) + 1;
    }
    return counts;
  }, {});
  // These are the ML-extracted skills saved on the authenticated user's MongoDB document.
  const mlSkills = Array.isArray(profile?.skills) ? profile.skills : [];
  const recentRepos = repos
    .filter((repo) => !repo.fork)
    .slice(0, 5);

  const handleLogout = () => {
    onLogout();
  };

  const handleJourneySelect = (index) => {
    if (index === 0) {
      onBack();
      return;
    }

    if ((index === 2 || index === 3) && onJourneySelect) {
      onJourneySelect(index);
      return;
    }

    setActiveJourney(index);
    requestAnimationFrame(() => {
      const target = journey[index]?.target;
      if (target) {
        sectionRefs.current[target]?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  };

  const stats = [
    { label: "Repositories", value: profile?.public_repos ?? "—", unit: "public" },
    { label: "Followers", value: profile?.followers ?? "—", unit: "on GitHub" },
    { label: "Following", value: profile?.following ?? "—", unit: "accounts" },
    { label: "Languages", value: Object.keys(languages).length, unit: "detected" },
  ];

  return (
    <div className="profile-preview-layout">
      <JourneySidebar
        activeStep={activeJourney}
        onSelect={handleJourneySelect}
        onLogout={handleLogout}
      />

      <main className="profile-preview-main">
        <div className="preview-breadcrumb">
          DevPath / <b>{showRepositories ? "Repositories" : "Profile Preview"}</b>
        </div>
        <hr className="rule" />

        <span className="pill">
          <i /> Developer profile
        </span>
        <h1 className="title">
          {showRepositories ? `@${profile?.login || username || "your"}'s repositories` : profile?.name || `@${username}`}
        </h1>
        <p className="subtitle">
          {showRepositories
            ? `Repositories for @${profile?.login || username || "your GitHub account"}.`
            : `GitHub profile insights for @${profile?.login || username || "your account"}.`}
        </p>

        <section className="journey-description" aria-live="polite">
          <strong>{journey[activeJourney].title}</strong>
          <p>{journey[activeJourney].description}</p>
        </section>

        {loading && (
          <p className="profile-message" role="status">
            Loading your GitHub profile…
          </p>
        )}

        {error && (
          <section className="profile-message profile-error" role="alert">
            <strong>Could not load this profile</strong>
            <p>{error}</p>
            <button
              className="retry-button"
              type="button"
              onClick={() => {
                setLoading(true);
                setError("");
                setRetryCount((count) => count + 1);
              }}
            >
              Try again
            </button>
          </section>
        )}

        {!loading && !error && profile && (
          <>
            {showRepositories ? (
              <section className="card repositories-page">
                <div className="repositories-page-head">
                  <button
                    className="back-profile-button"
                    type="button"
                    onClick={() => setShowRepositories(false)}
                  >
                    &larr; Back to profile
                  </button>
                  <a
                    className="profile-link"
                    href={`${profile.html_url}?tab=repositories`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open repositories on GitHub
                  </a>
                </div>
                <p className="muted small">
                  Showing {repos.length} of {profile.public_repos} public repositories
                  (up to 100, sorted by recently updated).
                </p>
                {repos.length ? (
                  <ul className="repository-list repositories-page-list">
                    {repos.map((repo) => (
                      <li key={repo.id}>
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {repo.name}
                        </a>
                        <span>
                          {repo.description || "No description provided"}
                        </span>
                        <span>
                          {repo.language || "Language not specified"} · ★ {repo.stargazers_count} ·{" "}
                          {repo.fork ? "Fork" : "Repository"}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty-message">This user has no public repositories.</p>
                )}
              </section>
            ) : (
              <>
            <section
              className="card summary journey-section"
              id="profile-overview"
              ref={(element) => {
                sectionRefs.current["profile-overview"] = element;
              }}
            >
              <div className="user">
                <img className="avatar profile-avatar" src={profile.avatar_url || profile.avatar} alt="" />
                <div>
                  <div className="username">@{profile.login || profile.username}</div>
                  <div className="muted small">
                    {profile.bio || "No public bio provided"}
                  </div>
                  {profile.html_url && (
                    <a
                      className="profile-link"
                      href={profile.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View GitHub profile
                    </a>
                  )}
                </div>
              </div>
              {stats.map((stat) => (
                <div className="stat" key={stat.label}>
                  <div className="stat-label">{stat.label}</div>
                  <div className="stat-value">
                    <span>{stat.value}</span>
                    <small>{stat.unit}</small>
                  </div>
                </div>
              ))}
            </section>

            <div className="grid">
              <section
                className="card skills journey-section"
                id="profile-skills"
                ref={(element) => {
                  sectionRefs.current["profile-skills"] = element;
                }}
              >
                <h2 className="card-title">SKILLS IDENTIFIED BY ML</h2>
                <p className="muted small">
                  Technologies inferred by DevPath from your analyzed repositories.
                </p>
                {mlSkills.length ? (
                  <ul className="skill-list">
                    {mlSkills.map((skill, index) => {
                      const item = typeof skill === "string" ? { name: skill } : skill;
                      const rawConfidence = Number(item.confidence);
                      const confidence = Number.isFinite(rawConfidence)
                        ? Math.max(0, Math.min(100, Math.round(rawConfidence <= 1 ? rawConfidence * 100 : rawConfidence)))
                        : null;
                      const evidence = Array.isArray(item.evidence) ? item.evidence.filter(Boolean) : [];

                      return (
                        <li className="skill" key={`${item.name || "skill"}-${index}`}>
                          <div className="badge">{String(item.name || "?").slice(0, 3).toUpperCase()}</div>
                          <div className="skill-body">
                            <div className="skill-head">
                              <span className="skill-name">{item.name || "Unnamed skill"}</span>
                              {confidence !== null && <span className="tag orange">{confidence}% CONFIDENCE</span>}
                            </div>
                            {evidence.length > 0 && (
                              <p className="muted small">Evidence: {evidence.slice(0, 3).join(", ")}</p>
                            )}
                            {item.source && <p className="muted small">Source: {item.source}</p>}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="empty-message">
                    No ML-extracted skills were returned by the backend yet. Confirm that repository analysis has completed, then reload this page.
                  </p>
                )}
              </section>

              <div className="side">
                <section
                  className="card next journey-section"
                  id="profile-issues"
                  ref={(element) => {
                    sectionRefs.current["profile-issues"] = element;
                  }}
                >
                  <h3 className="serif">Explore this profile</h3>
                  <p>
                    Browse @{profile.login || profile.username}&apos;s public repositories on GitHub.
                  </p>
                    <button
                      className="cta repository-cta"
                      type="button"
                      onClick={() => setShowRepositories(true)}
                    >
                      View repositories
                    </button>
                </section>

                <section
                  className="card activity journey-section"
                  id="profile-contributions"
                  ref={(element) => {
                    sectionRefs.current["profile-contributions"] = element;
                  }}
                >
                  <div className="activity-head">
                    <b>Recent public repositories</b>
                    <span className="muted">{recentRepos.length}</span>
                  </div>
                  {recentRepos.length ? (
                    <ul className="repository-list">
                      {recentRepos.map((repo) => (
                        <li key={repo.id}>
                          <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {repo.name}
                          </a>
                          <span>
                            {repo.language || "Language not specified"} · ★ {repo.stargazers_count}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="empty-message">No public repositories to show.</p>
                  )}
                </section>
              </div>
            </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
