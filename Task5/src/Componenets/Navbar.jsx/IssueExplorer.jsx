import {
  FiSearch,
  FiBell,
  FiExternalLink,
  FiArrowRight,
} from "react-icons/fi";
import JourneySidebar from "./JourneySidebar";
import { useEffect, useState } from "react";
import { getRecommendedIssues } from "../../services/api.js";
import "./IssueExplorer.css";

export default function IssueExplorer({
  username = "username",
  onJourneySelect,
  onLogout,
}) {

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  async function loadIssues() {
    try {
      setLoading(true);
      setError("");

      const response = await getRecommendedIssues();

      setIssues(
        response?.data?.issues ??
        response?.issues ??
        []
      );
    } catch (err) {
      setError(err.message || "Failed to load recommended issues.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadIssues();
  }, []);

  const filteredIssues = issues.filter((issue) => {
    const query = search.toLowerCase();

    return [
      issue.title,
      issue.repositoryFullName,
      issue.description,
      ...(issue.labels || []),
      ...(issue.matchedSkills || []),
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));
  });
  return (
    <div className="issue-explorer-layout">
      <JourneySidebar
        activeStep={2}
        onSelect={onJourneySelect}
        onLogout={onLogout}
      />
      <div className="issue-page">
        <header className="issue-navbar">

          <div className="issue-breadcrumb">
            <span>DevPath</span>
            <b>/</b>
            <span>Explore issues</span>
            <b>/</b>
            <span className="issue-repository-name">open-source/ui-kit</span>
            <b>/</b>
            <span>#482</span>
          </div>

          <div className="navbar-right">

            <div className="search-box">
              <FiSearch />
              <input placeholder="Search..." />
            </div>

            <FiBell className="bell-icon" />

            <div className="profile">
              <div className="issue-avatar">{username.charAt(0).toUpperCase() || "M"}</div>

              <div>
                <strong>{username}</strong>
                <small>Student Developer</small>
              </div>
            </div>

          </div>
        </header>

        <main className="issue-main">
          <div className="issue-label">
            <span>•</span>
            PERSONALIZED ISSUE RECOMMENDATIONS
          </div>

          <section className="issue-header">
            <div>
              <h1>Issues picked for your skills.</h1>
              <p className="issue-subtitle">
                Ranked using your GitHub profile and ML skill matching.
              </p>
            </div>

            <button
              className="save-btn"
              onClick={loadIssues}
              disabled={loading}
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </section>

          <div className="issue-search">
            <FiSearch />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search issues, repositories, or skills..."
            />
          </div>

          {loading && (
            <p className="issue-message" role="status">
              Finding issues matched to your skills...
            </p>
          )}

          {error && (
            <div className="issue-message issue-error" role="alert">
              <p>{error}</p>
              <button className="save-btn" onClick={loadIssues}>
                Try again
              </button>
            </div>
          )}

          {!loading && !error && filteredIssues.length === 0 && (
            <div className="issue-message">
              <h2>No recommendations found</h2>
              <p>
                {issues.length
                  ? "Try a different search."
                  : "Analyze your GitHub repositories and skills first, then refresh."}
              </p>
            </div>
          )}

          {!loading && !error && filteredIssues.length > 0 && (
            <>
              <p className="issue-results-count">
                {filteredIssues.length} recommended issue
                {filteredIssues.length !== 1 ? "s" : ""}
              </p>

              <section className="recommended-issues">
                {filteredIssues.map((issue) => (
                  <article
                    className="recommended-issue-card"
                    key={issue.githubId}
                  >
                    <div className="recommended-issue-top">
                      <span className="issue-open-badge">
                        <span className="open-dot" />
                        {issue.state || "open"}
                      </span>

                      <span className="issue-score">
                        {issue.relevanceScore ?? 0}% match
                      </span>
                    </div>

                    <h2>{issue.title}</h2>

                    <p className="issue-repo">
                      {issue.repositoryFullName || "GitHub repository"}
                      {issue.language ? ` · ${issue.language}` : ""}
                    </p>

                    <p className="recommended-issue-description">
                      {issue.description?.trim()
                        ? issue.description.slice(0, 350)
                        : "No description provided."}
                      {issue.description?.length > 350 ? "..." : ""}
                    </p>

                    {issue.matchedSkills?.length > 0 && (
                      <div className="issue-tags">
                        {issue.matchedSkills.map((skill) => (
                          <span key={skill}>
                            <i />
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {issue.labels?.length > 0 && (
                      <div className="issue-label-list">
                        {issue.labels.map((label) => (
                          <span key={label}>{label}</span>
                        ))}
                      </div>
                    )}

                    {issue.recommendationReason && (
                      <div className="issue-reason">
                        <strong>Why this fits you</strong>
                        <p>{issue.recommendationReason}</p>
                      </div>
                    )}

                    {issue.missingSkills?.length > 0 && (
                      <p className="issue-missing-skills">
                        Skills to explore: {issue.missingSkills.join(", ")}
                      </p>
                    )}

                    <div className="recommended-issue-footer">
                      <span>
                        {issue.comments ?? 0} comments
                      </span>

                      <a
                        href={issue.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open on GitHub <FiExternalLink />
                      </a>
                    </div>
                  </article>
                ))}
              </section>
            </>
          )}
        </main>


      </div>
    </div>
  );
}


function FitRow({ title, heading, description }) {
  return (
    <div className="fit-row">

      <strong>{title}</strong>

      <div className="fit-info">
        <h3>{heading}</h3>

        <p>{description}</p>
      </div>

      <a href="#evidence">
        View evidence <FiArrowRight />
      </a>

    </div>
  );
}


function Detail({ label, value }) {
  return (
    <div className="detail-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}


function Step({ number, title, description }) {
  return (
    <div className="start-step">

      <strong>{number}</strong>

      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

    </div>
  );
}