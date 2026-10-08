import {
  FiSearch,
  FiBell,
  FiExternalLink,
  FiArrowRight,
} from "react-icons/fi";
import JourneySidebar from "./JourneySidebar";
import "./IssueExplorer.css";

export default function IssueExplorer({
  username = "username",
  onJourneySelect,
  onLogout,
}) {
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

        {/* Label */}
        <div className="issue-label">
          <span>•</span>
          ISSUES EXPLORER
        </div>
        <section className="issue-header">

          <div>
            <h1>Add dark mode to settings</h1>

            <div className="issue-status">
              <span className="open-dot"></span>
              <b>Open</b>

              <span>Opened 2 days ago by ui-maintainer.</span>
              <span>12 comments.</span>
              <span>Last activity yesterday</span>
            </div>
          </div>

          <div className="issue-actions">
            <button className="save-btn">
              Save
            </button>

            <a href="#github">
              Open in GitHub <FiExternalLink />
            </a>
          </div>

        </section>
        <div className="issue-tags">

          <span>
            <i></i>
            React
          </span>

          <span>
            <i></i>
            CSS
          </span>

          <span>
            <i></i>
            Good first issue
          </span>

        </div>
        <div className="orange-line"></div>
        <div className="issue-content">
          <section className="issue-left">

            <h2>Why this fits you</h2>


            <FitRow
              title="REACT"
              heading="Used in 3 days of your repositories"
              description="campus-app, portfolio-site and event planner all use React with hooks and context."
            />

            <FitRow
              title="CSS"
              heading="Present in 2 repositories"
              description="Custom properties and responsive layout in portfolio-site and landing-kit."
            />

            <FitRow
              title="SCOPE"
              heading="Small, well-defined change"
              description="The maintainer has replied to every contributor within a day."
            />
            <div className="description-section">

              <h2>Description</h2>

              <p>
                The settings screens only support a light theme. Add a toggle
                that lets users choose light, dark or system, and apply the
                choice across every settings component. The theme should follow
                the operating system on first load and remember the user's
                selection afterwards.
              </p>


              <h3>Acceptance Criteria</h3>

              <ul>
                <li>
                  The toggle in Settings switches between light, dark and
                  system themes.
                </li>

                <li>
                  The selection persists across sessions.
                </li>

                <li>
                  All settings components read colors from the shared theme
                  tokens.
                </li>

                <li>
                  The settings side panels support this option.
                </li>
              </ul>

            </div>
            <div className="files-section">

              <h3>Files likely to change</h3>

              <div className="file-row">
                <code>src/components/Settings/ThemeToggle.tsx</code>
                <span>New Component</span>
                <b>Add</b>
              </div>

              <div className="file-row">
                <code>src/hooks/useTheme.ts</code>
                <span>Reads and stores preference</span>
                <b>Add</b>
              </div>

              <div className="file-row">
                <code>src/styles/tokens.css</code>
                <span>Dark color tokens</span>
                <span>Edit</span>
              </div>

              <div className="file-row">
                <code>docs/theming.md</code>
                <span>Usage note</span>
                <span>Edit</span>
              </div>

            </div>

          </section>
          <aside className="issue-right">

            <h2>Details</h2>

            <Detail label="Difficulty" value="Beginner" />
            <Detail label="Estimated Time" value="3 to 5 hrs" />
            <Detail label="Languages" value="TypeScript, CSS" />
            <Detail label="Assignee" value="Unassigned" />
            <Detail label="Milestone" value="v2.4" />
            <Detail label="Linked PRs" value="None" />

            <div className="start-section">

              <h2>How to get started</h2>

              <Step
                number="01"
                title="Comment on the issue"
                description="Let the maintainers know you are working on it."
              />

              <Step
                number="02"
                title="Fork and run locally"
                description="The setup steps are in CONTRIBUTING.md."
              />

              <Step
                number="03"
                title="Make the change"
                description="Keep the diff small and follow the existing patterns."
              />

              <Step
                number="04"
                title="Open a pull request"
                description="Reference #482 in the description."
              />

            </div>
            <div className="repository">

              <h2>Repository</h2>

              <Detail
                label="Medium review time"
                value="Under 24 hours"
              />

              <Detail
                label="Open issues"
                value="38"
              />

              <Detail
                label="Contributors"
                value="126"
              />

            </div>

          </aside>

        </div>

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