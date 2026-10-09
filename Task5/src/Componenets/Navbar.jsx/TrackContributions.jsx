import { useState } from "react";
import { FiSearch, FiBell, FiArrowRight, FiPlus } from "react-icons/fi";
import JourneySidebar from "./JourneySidebar";
import "./TrackContributions.css";

const stats = [
  { value: "4", label: "Issues tracked", sub: "+2 this month" },
  { value: "1", label: "Merged", sub: "Last: 4 days ago" },
  { value: "3.5", label: "Days per issue", sub: "Median, last 30 days" },
];

const columns = [
  {
    key: "saved",
    title: "Saved",
    subtitle: "Issues you want to work on later",
    count: 1,
    card: {
      code: "UI",
      repo: "open-source/ui-kit",
      number: "#482",
      title: "Add dark mode to settings",
      desc: "Implement a dark mode toggle in settings with system preference detection.",
      tags: ["React", "TypeScript", "UI/UX"],
      rows: [
        ["Saved", "2 days ago"],
        ["Difficulty", "Beginner"],
        ["Status", "Working not started"],
      ],
    },
    footer: (
      <button className="tc-add">
        <FiPlus /> Add another saved issue
      </button>
    ),
  },
  {
    key: "working",
    title: "Working",
    subtitle: "Issues you are actively working on",
    count: 1,
    card: {
      code: "CD",
      repo: "Community/Dashboard",
      number: "#217",
      title: "Improve empty-state messages",
      desc: "Make empty states more helpful and actionable across the dashboard.",
      tags: ["React", "Design", "Accessibility"],
      rows: [
        ["Started", "3 days ago"],
        ["Tasks", "2 of 5 done"],
      ],
      progress: 45,
      action: "Open a pull request",
    },
  },
  {
    key: "pr",
    title: "PR Submitted",
    subtitle: "Pull request opened.",
    count: 1,
    card: {
      code: "CL",
      repo: "Tools/CLI",
      number: "#42",
      title: "Add keyboard shortcuts",
      desc: "Introduce keyboard shortcuts for common CLI commands to improve productivity.",
      tags: ["React", "CLI", "Productivity"],
      rows: [
        ["Pull request", "Awaiting Review"],
        ["Checks", "3 of 3 passing"],
      ],
      progress: 80,
      action: "Respond to review",
    },
  },
  {
    key: "merged",
    title: "Merged",
    subtitle: "Accepted into the project.",
    count: 1,
    card: {
      code: "DP",
      repo: "Docs/Project",
      number: "#9",
      title: "Update setup guide",
      desc: "Clarify installation steps and add troubleshooting for common issues.",
      tags: ["Markdown", "Docs", "Beginner"],
      rows: [
        ["Merged", "4 days ago"],
        ["Changes", "+42 -8"],
      ],
      progress: 100,
      action: "Share what you learned",
    },
  },
];

const heatmap = [
  [0, 1, 0, 0, 2, 0, 0, 0, 1, 0, 3, 4],
  [0, 1, 0, 1, 3, 1, 0, 0, 0, 0, 1, 4],
  [0, 0, 1, 4, 4, 0, 0, 0, 2, 0, 4, 4],
  [0, 1, 0, 3, 4, 0, 2, 1, 4, 2, 3, 4],
  [3, 4, 2, 4, 4, 1, 4, 0, 4, 3, 4, 4],
];

const activity = [
  { color: "orange", title: "Pull request #42 submitted", repo: "tools/cli", time: "Yesterday" },
  { color: "white", title: "Started working", repo: "community/dashboard", time: "3 days ago" },
  { color: "white", title: "Saved an issue", repo: "open-source/ui-kit", time: "2 days ago" },
  { color: "green", title: "Contribution merged", repo: "docs/project", time: "4 days ago" },
];

function IssueCard({ card, variant }) {
  return (
    <div className="tc-card">
      <div className="tc-card-top">
        <span className="tc-code">
          <span className="tc-code-badge">{card.code}</span>
          {card.repo}
        </span>
        <span className="tc-muted">{card.number}</span>
      </div>

      <h4 className="tc-card-title">{card.title}</h4>
      <p className="tc-card-desc">{card.desc}</p>

      <div className="tc-tags">
        {card.tags.map((tag) => (
          <span key={tag} className="tc-tag">
            <i className="tc-tag-dot" />
            {tag}
          </span>
        ))}
      </div>

      <div className="tc-rows">
        {card.rows.map(([label, value]) => (
          <div key={label} className="tc-row">
            <span>{label}</span>
            <span>{value}</span>
          </div>
        ))}
      </div>

      {card.progress !== undefined && (
        <>
          <div className="tc-bar">
            <div
              className={`tc-bar-fill tc-bar-${variant}`}
              style={{ width: `${card.progress}%` }}
            />
          </div>
          <div className="tc-card-footer">
            <button className="tc-link">
              {card.action} <FiArrowRight />
            </button>
            <span>{card.progress}%</span>
          </div>
        </>
      )}
    </div>
  );
}

export default function TrackContributions({ onJourneySelect, onLogout }) {
  const [tab, setTab] = useState("Board");

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
          {stats.map((s) => (
            <div key={s.label} className="tc-stat">
              <div className="tc-stat-value">{s.value}</div>
              <div className="tc-stat-label">{s.label}</div>
              <div className="tc-stat-sub">{s.sub}</div>
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
      <section className="tc-board">
        {columns.map((col) => (
          <div key={col.key} className="tc-column">
            <div className="tc-col-head">
              <div className="tc-col-title">
                <i className={`tc-status-dot dot-${col.key}`} />
                <strong>{col.title}</strong>
                <span className="tc-muted tc-col-count">{col.count}</span>
              </div>
              <p className="tc-muted">{col.subtitle}</p>
            </div>
            <IssueCard card={col.card} variant={col.key} />
            {col.footer}
          </div>
        ))}
      </section>
      <section className="tc-bottom">
        <div className="tc-panel">
          <div className="tc-panel-head">
            <strong>Contribution Activity</strong>
            <span className="tc-accent">Last 20 weeks</span>
          </div>
          <div className="tc-months">
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
          </div>
          <div className="tc-heatmap">
            {heatmap.map((row, r) =>
              row.map((level, c) => (
                <span key={`${r}-${c}`} className={`tc-cell level-${level}`} />
              ))
            )}
          </div>
          <div className="tc-heat-footer">
            <span className="tc-legend">
              Less
              {[0, 1, 2, 3, 4].map((l) => (
                <i key={l} className={`tc-cell level-${l}`} />
              ))}
              More
            </span>
            <span>412 commits in the last 12 months</span>
          </div>
        </div>
        <div className="tc-panel tc-panel-bordered">
          <div className="tc-panel-head">
            <strong>Recent Activity</strong>
            <button className="tc-accent tc-plain">View all</button>
          </div>
          <ul className="tc-timeline">
            {activity.map((a) => (
              <li key={a.title}>
                <i className={`tc-tl-dot tl-${a.color}`} />
                <div>
                  <div className="tc-tl-title">{a.title}</div>
                  <div className="tc-muted">{a.repo}</div>
                </div>
                <span className="tc-muted">{a.time}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="tc-panel tc-panel-bordered">
          <strong>Monthly goal</strong>
          <div className="tc-goal">
            <span className="tc-goal-big">1 of 4</span>
            <span className="tc-muted">merged in October</span>
          </div>
          <div className="tc-bar">
            <div className="tc-bar-fill tc-bar-pr" style={{ width: "25%" }} />
          </div>
          <div className="tc-row tc-goal-row">
            <span>Merge 3 more by October 31</span>
            <span>25%</span>
          </div>
          <div className="tc-row">
            <span>Current Streak</span>
            <span>3 days</span>
          </div>
          <div className="tc-row">
            <span>Skills Practiced</span>
            <span>React, CSS, Markdown</span>
          </div>
          <div className="tc-row">
            <span>Next milestone</span>
            <span>First review response</span>
          </div>
        </div>
      </section>
      </main>
    </div>
  );
}