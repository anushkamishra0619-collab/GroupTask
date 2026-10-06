import { VscGithub } from "react-icons/vsc";

import { useEffect, useState } from "react";
import { FiPower } from "react-icons/fi";
import { FaRegCircle, FaCircle } from "react-icons/fa";
import "./ProfileSkills.css";

const journey = [
  {
    title: "Analyze Profile",
    sub: "Public profile overview",
    description:
      "Review the public account details and repository totals for this GitHub profile.",
  },
  {
    title: "Understand skills",
    sub: "Languages found in repositories",
    description:
      "See the programming languages GitHub reports for this user's public repositories, with the number of repositories using each language.",
  },
  {
    title: "Explore issues",
    sub: "Find a place to contribute",
    description:
      "Use the skills identified above to look for open-source issues tagged with a matching language or technology. Issue matching is not available yet.",
  },
  {
    title: "Track contributions",
    sub: "Continue your progress",
    description:
      "Keep building your public project history. This preview currently shows public repositories and does not yet track contribution history over time.",
  },
];

async function fetchGitHubData(username, signal) {
  const headers = { Accept: "application/vnd.github+json" };
  const [userResponse, reposResponse] = await Promise.all([
    fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
      headers,
      signal,
    }),
    fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`,
      { headers, signal },
    ),
  ]);

  if (userResponse.status === 404) {
    throw new Error(`No GitHub user named "${username}" was found.`);
  }
  if (!userResponse.ok || !reposResponse.ok) {
    const response = !userResponse.ok ? userResponse : reposResponse;
    if (response.status === 403 || response.status === 429) {
      throw new Error("GitHub's public API rate limit was reached. Please try again later.");
    }
    throw new Error("GitHub profile data could not be loaded. Please try again.");
  }

  return {
    user: await userResponse.json(),
    repos: await reposResponse.json(),
  };
}

export default function ProfilePreview({ username, onBack }) {
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeJourney, setActiveJourney] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [showRepositories, setShowRepositories] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetchGitHubData(username, controller.signal)
      .then(({ user, repos: userRepos }) => {
        setProfile(user);
        setRepos(userRepos);
      })
      .catch((fetchError) => {
        if (fetchError.name !== "AbortError") {
          setError(fetchError.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [username, retryCount]);

  const languages = repos.reduce((counts, repo) => {
    if (repo.language) {
      counts[repo.language] = (counts[repo.language] || 0) + 1;
    }
    return counts;
  }, {});
  const topLanguages = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxLanguageCount = topLanguages[0]?.[1] || 1;
  const recentRepos = repos
    .filter((repo) => !repo.fork)
    .slice(0, 5);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      onBack();
    }
  };

  const stats = [
    { label: "Repositories", value: profile?.public_repos ?? "—", unit: "public" },
    { label: "Followers", value: profile?.followers ?? "—", unit: "on GitHub" },
    { label: "Following", value: profile?.following ?? "—", unit: "accounts" },
    { label: "Languages", value: Object.keys(languages).length, unit: "detected" },
  ];

  return (
    <div className="app">
      <aside className="sidebar">
        <div>
          <div className="logo">
            <VscGithub size={22} />
            <span>DevPath</span>
          </div>

          <p className="journey-label">YOUR JOURNEY</p>
          <ul className="steps">
            {journey.map((step, index) => (
              <li key={step.title}>
                <button
                  type="button"
                  className={`step ${activeJourney === index ? "active" : ""}`}
                  aria-current={activeJourney === index ? "step" : undefined}
                  onClick={() => setActiveJourney(index)}
                >
                  <span className="step-icon">
                    {activeJourney === index ? <FaCircle /> : <FaRegCircle />}
                  </span>
                  <span>
                    <span className="step-title">{step.title}</span>
                    <span className="step-sub">{step.sub}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <hr className="divider" />
          <p className="tagline">
            A clearer path
            <span>from curious to shipped.</span>
          </p>
        </div>

        <button className="logout" type="button" onClick={handleLogout}>
          <FiPower /> Log Out
        </button>
      </aside>

      <main className="main">
        <div className="breadcrumb">
          DevPath / <b>{showRepositories ? "Repositories" : "Profile Preview"}</b>
        </div>
        <hr className="rule" />

        <span className="pill">
          <i /> Developer profile
        </span>
        <h1 className="title">
          {showRepositories ? `@${profile?.login || username}'s repositories` : profile?.name || `@${username}`}
        </h1>
        <p className="subtitle">
          {showRepositories
            ? `Public repositories for @${profile?.login || username}.`
            : `Public GitHub profile insights for @${username}.`}
        </p>

        <section className="journey-description" aria-live="polite">
          <strong>{journey[activeJourney].title}</strong>
          <p>{journey[activeJourney].description}</p>
        </section>

        {loading && (
          <p className="profile-message" role="status">
            Loading GitHub profile for @{username}…
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
            <section className="card summary">
              <div className="user">
                <img className="avatar profile-avatar" src={profile.avatar_url} alt="" />
                <div>
                  <div className="username">@{profile.login}</div>
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
              <section className="card skills">
                <h2 className="card-title">LANGUAGES FOUND</h2>
                <p className="muted small">
                  Based on the primary language of up to 100 recently updated public repositories.
                </p>
                {topLanguages.length ? (
                  <ul className="skill-list">
                    {topLanguages.map(([language, count]) => {
                      const percentage = Math.round((count / maxLanguageCount) * 100);
                      return (
                        <li className="skill" key={language}>
                          <div className="badge">{language.slice(0, 3)}</div>
                          <div className="skill-body">
                            <div className="skill-head">
                              <span className="skill-name">{language}</span>
                              <span className="tag orange">
                                {count} {count === 1 ? "REPOSITORY" : "REPOSITORIES"}
                              </span>
                            </div>
                            <div className="bar-row">
                              <div className="bar">
                                <div
                                  className="fill orange"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="pct">{count}</span>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="empty-message">
                    No primary languages were reported for this user's public repositories.
                  </p>
                )}
              </section>

              <div className="side">
                <section className="card next">
                  <h3 className="serif">Explore this profile</h3>
                  <p>
                    Browse @{profile.login}&apos;s public repositories on GitHub.
                  </p>
                    <button
                      className="cta repository-cta"
                      type="button"
                      onClick={() => setShowRepositories(true)}
                    >
                      View repositories
                    </button>
                </section>

                <section className="card activity">
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
