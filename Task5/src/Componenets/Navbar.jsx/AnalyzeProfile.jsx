import "./AnalyzeProfile.css";
import JourneySidebar from "./JourneySidebar";

const AnalyzeProfile = ({
  username = "username",
  onJourneySelect,
  onBack,
}) => {
  return (
    <div className="analyze-page-layout">
      <JourneySidebar
        activeStep={0}
        onSelect={onJourneySelect}
        onLogout={onBack}
      />
      <main className="main analyze-profile">

      <div className="analysis-breadcrumb">
        <span>DevPath</span>
        <span>/</span>
        <span>Profile Analysis</span>
      </div>

      <div className="header-line"></div>

      <div className="profile-heading">

        <div className="analysis-badge">
          <span className="badge-dot"></span>
          Analysis in progress
        </div>

        <h1>
          We are building your starting point.
        </h1>

        <p>
          A quick read of <strong>@{username}</strong>'s public work,
          turned into useful, personalised direction.
        </p>

      </div>

      <div className="user-profile-card">

        <div className="user-details">

          <div className="user-avatar">
            {username.charAt(0).toUpperCase() || "M"}
            <span className="online-dot"></span>
          </div>

          <div>
            <h3>@{username}</h3>
            <p>
              Public profile connected, synced just now
            </p>
          </div>

        </div>


        <div className="profile-stat">
          <span>REPOSITORIES</span>
          <strong>08</strong>
          <small>public</small>
        </div>


        <div className="profile-stat">
          <span>LANGUAGES</span>
          <strong>05</strong>
          <small>detected</small>
        </div>


        <div className="profile-stat">
          <span>PROFILE SIGNAL</span>
          <strong className="orange-text">
            GOOD
          </strong>
          <small>78/100</small>
        </div>


        <div className="profile-stat">
          <span>COMMITS READ</span>
          <strong>412</strong>
          <small>last 12 mo</small>
        </div>

      </div>

      <div className="analysis-grid">

        <div className="signal-card">

          <div className="card-header">
            <h2>PROFILE SIGNAL</h2>

            <p>
              We are checking the building blocks of your developer profile.
            </p>
          </div>


          <div className="signal-content">

            <div className="progress-area">

              <div className="progress-circle">

                <div className="circle-content">
                  <strong>50%</strong>
                  <span>analyzed</span>
                </div>

              </div>

              <h3>Halfway there</h3>

              <p>
                We'll show you the useful parts next
              </p>

            </div>

            <div className="checking-area">

              <div className="checking-item">

                <div className="analysis-check-icon completed">
                  ✓
                </div>

                <div className="step-content">
                  <h4>Finding Repositories</h4>
                  <p>8 public repos found</p>
                </div>

                <span className="status done">
                  DONE
                </span>

              </div>

              <div className="checking-item">

                <div className="analysis-check-icon active">
                  ◉
                </div>

                <div className="step-content">
                  <h4>Reading Languages</h4>
                  <p>
                    React, TypeScript, CSS detected ·
                    2 more in progress
                  </p>
                </div>

                <span className="status progress">
                  IN PROGRESS · 62%
                </span>

              </div>

              <div className="checking-item">

                <div className="analysis-check-icon"></div>

                <div className="step-content">
                  <h4>Preparing language summary</h4>
                  <p>
                    based on public repository metadata
                  </p>
                </div>

                <span className="status queued">
                  QUEUED
                </span>

              </div>

              <div className="checking-item">

                <div className="analysis-check-icon"></div>

                <div className="step-content">
                  <h4>Loading public repositories</h4>
                  <p>
                    details returned by GitHub
                  </p>
                </div>

                <span className="status queued">
                  QUEUED
                </span>

              </div>

            </div>

          </div>

        </div>

        <div className="note-card">

          <div className="note-border"></div>

          <span className="note-label">
            A QUICK NOTE BEFORE YOUR RESULTS
          </span>

          <h2>
            You don't need to
            <span> know everything </span>
            before you begin.
          </h2>

          <p>
            Your existing work is enough to find one clear
            next step. We match you to projects at the right
            level, not the loudest ones.
          </p>

          <div className="note-divider"></div>

          <h4>
            HOW WE HANDLE YOUR DATA
          </h4>

          <ul>

            <li>
              <span>✓</span>
              Only public repositories are used
            </li>

            <li>
              <span>✓</span>
              Nothing in your code is changed
            </li>

            <li>
              <span>✓</span>
              Your evidence appears on next step
            </li>

          </ul>

          <div className="policy">
            Read our data policy →
          </div>

        </div>

      </div>

      <div className="bottom-grid">

        <div className="languages-card">

          <div className="section-heading">
            <h2>LANGUAGES DETECTED</h2>
            <span>by code volume</span>
          </div>


          <div className="language-bar">

            <div className="typescript"></div>
            <div className="react"></div>
            <div className="css"></div>
            <div className="html"></div>
            <div className="others"></div>

          </div>


          <div className="language-list">

            <div>
              <span className="dot ts"></span>
              TypeScript
              <b>38%</b>
            </div>

            <div>
              <span className="dot react-dot"></span>
              React (JSX/TSX)
              <b>27%</b>
            </div>

            <div>
              <span className="dot css-dot"></span>
              CSS
              <b>19%</b>
            </div>

            <div>
              <span className="dot html-dot"></span>
              HTML
              <b>11%</b>
            </div>

            <div>
              <span className="dot other-dot"></span>
              Others
              <b>5%</b>
            </div>

          </div>

          <p className="reading-text">
            Still reading 2 repos...
          </p>

        </div>

        <div className="activity-card">

          <div className="section-heading">

            <h2>ACTIVITY LOG</h2>

            <span>
              streaming
              <i className="stream-dot"></i>
            </span>

          </div>


          <div className="activity-list">

            <p>
              <time>00:03</time>
              <b>✓</b>
              connected to public profile @{username}
            </p>

            <p>
              <time>00:09</time>
              <b>✓</b>
              indexed 8 repositories
              (3 active in last 90d)
            </p>

            <p>
              <time>00:18</time>
              <b>✓</b>
              read 412 commits across 1,234 files
            </p>

            <p className="orange-log">
              <time>00:27</time>
              <b>›</b>
              Classifying languages and frameworks
            </p>

            <p className="orange-log">
              <time>00:34</time>
              <b>›</b>
              resolving dependencies in package.json
            </p>

          </div>

        </div>

        <div className="next-card-section">

          <div className="section-heading">
            <h2>COMING UP NEXT</h2>
          </div>


          <div className="next-item">

            <span className="next-number">
              02
            </span>

            <div>
              <h4>Your skill map</h4>
              <p>Strengths and gaps, backed by evidence</p>
            </div>

            <span className="next-time">
              ~1 min
            </span>

          </div>


          <div className="next-item">

            <span className="next-number">
              03
            </span>

            <div>
              <h4>Matched Issues</h4>
              <p>Beginner-friendly tasks ranked by fit</p>
            </div>

            <span className="next-time">
              ~3 min
            </span>

          </div>


          <div className="next-item">

            <span className="next-number">
              04
            </span>

            <div>
              <h4>Track contributions</h4>
              <p>Follow progress from first PR to merge</p>
            </div>

            <span className="next-time">
              Ongoing
            </span>

          </div>

        </div>

      </div>

      </main>
    </div>
  );
};

export default AnalyzeProfile;