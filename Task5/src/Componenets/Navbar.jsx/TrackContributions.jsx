import { useEffect, useMemo, useState } from "react";
import {
  getContributions,
  updateContributionStatus,
  deleteContribution,
} from "../../services/api.js";

import {
  FiSearch,
  FiBell,
  FiArrowRight,
  FiTrash2,
} from "react-icons/fi";

import JourneySidebar from "./JourneySidebar";
import "./TrackContributions.css";


export default function TrackContributions({ onJourneySelect, onLogout }) {
  const [tab, setTab] = useState("Board");


  const [contributions, setContributions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadContributions() {
    try {
      setLoading(true);
      setError("");

      const response = await getContributions();

      setContributions(
        response?.data?.contributions ?? []
      );
    } catch (err) {
      setError(err.message || "Failed to load contributions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadContributions();
  }, []);

  const statuses = [
    { key: "saved", title: "Saved" },
    { key: "working", title: "Working" },
    { key: "pr_submitted", title: "PR Submitted" },
    { key: "merged", title: "Merged" },
  ];

  const filteredContributions = useMemo(() => {
    const query = search.toLowerCase().trim();

    return contributions.filter((item) =>
      [
        item.title,
        item.repositoryFullName,
        item.description,
        ...(item.labels || []),
        ...(item.matchedSkills || []),
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [contributions, search]);

  async function changeStatus(id, status) {
    try {
      const response = await updateContributionStatus(id, status);
      const updated = response?.data?.contribution;

      if (updated) {
        setContributions((previous) =>
          previous.map((item) =>
            item._id === id ? updated : item
          )
        );
      }
    } catch (err) {
      setError(err.message || "Could not update status");
    }
  }

  async function removeContribution(id) {
    try {
      await deleteContribution(id);
      setContributions((previous) =>
        previous.filter((item) => item._id !== id)
      );
    } catch (err) {
      setError(err.message || "Could not remove contribution");
    }
  }

  const stats = [
    {
      label: "Issues tracked",
      value: contributions.length,
    },
    {
      label: "Merged",
      value: contributions.filter((item) => item.status === "merged").length,
    },
    {
      label: "In progress",
      value: contributions.filter((item) => item.status === "working").length,
    },
  ];


  return (
    <div className="tc-layout">
      <JourneySidebar
        activeStep={3}
        onSelect={onJourneySelect}
        onLogout={onLogout}
      />
      <main className="tc-page">
        <header className="tc-topbar">
          <nav className="tc-breadcrumb">
            <span className="tc-muted">DevPath</span>
            <span className="tc-muted">/</span>
            <strong>Track Contributions</strong>
          </nav>

          <div className="tc-topbar-right">
            <label className="tc-search">
              <FiSearch />
              <input type="text" placeholder="Search..." />
            </label>
            <button className="tc-icon-btn" aria-label="Notifications">
              <FiBell />
            </button>
            <div className="tc-user">
              <span className="tc-avatar">M</span>
              <div>
                <div className="tc-user-name">Username</div>
                <div className="tc-user-role">Student Developer</div>
              </div>
            </div>
          </div>
        </header>
        <section className="tc-hero">
          <div>
            <span className="tc-pill">✦ TRACK CONTRIBUTIONS</span>
            <h1 className="tc-title">My Contributions</h1>
            <p className="tc-subtitle">Follow each issue from saved to merged.</p>
          </div>

          <div className="tc-stats">
            {stats.map((stat) => (
              <div key={stat.label} className="tc-stat">
                <div className="tc-stat-value">{stat.value}</div>
                <div className="tc-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
        <div className="tc-tabs">
          {["Board", "List", "Timeline"].map((t) => (
            <button
              key={t}
              className={`tc-tab ${tab === t ? "active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="tc-feedback">Loading your contributions...</p>
        ) : error ? (
          <div className="tc-feedback">
            <p>{error}</p>
            <button onClick={loadContributions}>Retry</button>
          </div>
        ) : filteredContributions.length === 0 ? (
          <div className="tc-feedback">
            <h3>No tracked contributions yet</h3>
            <p>
              Save an issue from Explore Issues to start tracking your progress.
            </p>
          </div>
        ) : (
          <section className="tc-board">
            {statuses.map((status) => {
              const items = filteredContributions.filter(
                (item) => item.status === status.key
              );

              return (
                <div key={status.key} className="tc-column">
                  <div className="tc-col-head">
                    <div className="tc-col-title">
                      <i className={`tc-status-dot dot-${status.key}`} />
                      <strong>{status.title}</strong>
                      <span className="tc-muted tc-col-count">
                        {items.length}
                      </span>
                    </div>
                  </div>

                  {items.map((item) => (
                    <article className="tc-card tc-live-card" key={item._id}>
                      <div className="tc-card-top">
                        <span className="tc-code">
                          {item.repositoryFullName}
                        </span>
                        <button
                          className="tc-delete"
                          title="Remove from tracker"
                          onClick={() => removeContribution(item._id)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>

                      <h4 className="tc-card-title">{item.title}</h4>
                      <p className="tc-card-desc">
                        {item.description || "No description provided."}
                      </p>

                      <div className="tc-tags">
                        {(item.matchedSkills || []).map((skill) => (
                          <span className="tc-tag" key={skill}>
                            <i className="tc-tag-dot" />
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="tc-status-control">
                        <label htmlFor={`status-${item._id}`}>
                          Update status
                        </label>
                        <select
                          id={`status-${item._id}`}
                          value={item.status}
                          onChange={(event) =>
                            changeStatus(item._id, event.target.value)
                          }
                        >
                          {statuses.map((option) => (
                            <option key={option.key} value={option.key}>
                              {option.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="tc-card-footer">
                        <a
                          className="tc-link"
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Open GitHub issue <FiArrowRight />
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              );
            })}
          </section>
        )}

        <section className="tc-bottom">
          <div className="tc-panel">
            <div className="tc-panel-head">
              <strong>Tracked issues</strong>
              <span className="tc-accent">
                {contributions.length} total
              </span>
            </div>

            <p className="tc-muted">
              Your tracker updates when you save an issue or change its status.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}