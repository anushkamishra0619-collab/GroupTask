import { useRef, useState } from "react";
import JourneySidebar from "./JourneySidebar";
import journey from "./journey";
import "./ProfileSkills.css";

const profile = {
  name: "The Octocat",
  login: "octocat",
  bio: "GitHub's mascot, wearing an octocat suit.",
  public_repos: 5,
  followers: 24000,
  following: 9,
  html_url: "https://github.com/octocat",
};

const repos = [
  {
    id: 1,
    name: "Hello-World",
    description: "A repository for testing GitHub workflows.",
    language: "Ruby",
    stargazers_count: 2400,
    fork: false,
    html_url: "https://github.com/octocat/Hello-World",
  },
  {
    id: 2,
    name: "Spoon-Knife",
    description: "A practical repository for learning forks and pull requests.",
    language: "HTML",
    stargazers_count: 12000,
    fork: false,
    html_url: "https://github.com/octocat/Spoon-Knife",
  },
  {
    id: 3,
    name: "git-consortium",
    description: "A small repository demonstrating Git collaboration.",
    language: "Shell",
    stargazers_count: 180,
    fork: false,
    html_url: "https://github.com/octocat/git-consortium",
  },
  {
    id: 4,
    name: "octocat.github.io",
    description: "A sample GitHub Pages site.",
    language: "HTML",
    stargazers_count: 90,
    fork: false,
    html_url: "https://github.com/octocat/octocat.github.io",
  },
  {
    id: 5,
    name: "boysenberry-repo-1",
    description: "A sample project from the Octocat profile.",
    language: "CSS",
    stargazers_count: 55,
    fork: false,
    html_url: "https://github.com/octocat/boysenberry-repo-1",
  },
];

export default function ProfilePreview({
  onBack,
  onLogout = onBack,
  onJourneySelect,
}) {
  const [activeJourney, setActiveJourney] = useState(1);
  const [showRepositories, setShowRepositories] = useState(false);
  const sectionRefs = useRef({});

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
    onLogout();
  };

  const handleJourneySelect = (index) => {
    if (index === 0) {
      onBack();
      return;
    }

    if (index === 2 && onJourneySelect) {
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
    { label: "Repositories", value: profile.public_repos, unit: "public" },
    { label: "Followers", value: profile.followers, unit: "on GitHub" },
    { label: "Following", value: profile.following, unit: "accounts" },
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
          {showRepositories ? `@${profile.login}'s repositories` : profile.name}
        </h1>
        <p className="subtitle">
          {showRepositories
            ? `Sample repositories for @${profile.login}.`
            : `Static sample GitHub profile for @${profile.login}.`}
        </p>

        <section className="journey-description" aria-live="polite">
          <strong>{journey[activeJourney].title}</strong>
          <p>{journey[activeJourney].description}</p>
        </section>

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
                  Showing {repos.length} sample public repositories.
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
                <div className="avatar profile-avatar" aria-hidden="true">O</div>
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
              <section
                className="card skills journey-section"
                id="profile-skills"
                ref={(element) => {
                  sectionRefs.current["profile-skills"] = element;
                }}
              >
                <h2 className="card-title">LANGUAGES FOUND</h2>
                <p className="muted small">
                  Based on the primary language of the sample repositories shown here.
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
                <section
                  className="card next journey-section"
                  id="profile-issues"
                  ref={(element) => {
                    sectionRefs.current["profile-issues"] = element;
                  }}
                >
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

                <section
                  className="card activity journey-section"
                  id="profile-contributions"
                  ref={(element) => {
                    sectionRefs.current["profile-contributions"] = element;
                  }}
                >
                  <div className="activity-head">
                    <b>Sample public repositories</b>
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
      </main>
    </div>
  );
}
