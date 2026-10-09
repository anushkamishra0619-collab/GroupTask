import { VscGithub } from "react-icons/vsc";


const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
    <circle cx="12" cy="12" r="12" fill="#fff" />
    <path
      fill="#0a0a0a"
      d="M12 3.2a8.8 8.8 0 0 0-2.78 17.15c.44.08.6-.19.6-.42v-1.5c-2.45.53-2.97-1.18-2.97-1.18-.4-1.02-.98-1.29-.98-1.29-.8-.55.06-.54.06-.54.89.06 1.35.91 1.35.91.79 1.35 2.07.96 2.57.73.08-.57.31-.96.56-1.18-1.96-.22-4.01-.98-4.01-4.36 0-.96.34-1.75.9-2.37-.09-.22-.39-1.12.09-2.33 0 0 .74-.24 2.42.9a8.4 8.4 0 0 1 4.4 0c1.68-1.14 2.42-.9 2.42-.9.48 1.21.18 2.11.09 2.33.56.62.9 1.41.9 2.37 0 3.39-2.06 4.14-4.02 4.35.32.27.6.81.6 1.64v2.43c0 .23.16.51.6.42A8.8 8.8 0 0 0 12 3.2Z"
    />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <path
      fill="currentColor"
      d="M17 9V7a5 5 0 0 0-10 0v2H5v12h14V9h-2Zm-8-2a3 3 0 0 1 6 0v2H9V7Zm3 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"
    />
  </svg>
);

const BarsIcon = () => (
  <svg viewBox="0 0 28 28" width="28" height="28" aria-hidden="true">
    <rect x="1" y="14" width="7" height="13" fill="currentColor" />
    <rect x="10" y="3" width="7" height="24" fill="currentColor" />
    <rect x="19" y="10" width="7" height="17" fill="currentColor" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 28 28" width="28" height="28" aria-hidden="true">
    <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="3" />
    <path d="M18 18l7 7" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
  </svg>
);

const TrophyIcon = () => (
  <svg viewBox="0 0 28 28" width="28" height="28" aria-hidden="true">
    <path
      fill="currentColor"
      d="M7 2h14v3h5v4c0 3-2.2 5-5.3 5.4A7 7 0 0 1 15 18.9V22h4v4H9v-4h4v-3.1a7 7 0 0 1-5.7-4.5C4.2 14 2 12 2 9V5h5V2Zm-2 5v2c0 1.2.8 2.2 2 2.6V7H5Zm18 0h-2v4.6c1.2-.4 2-1.4 2-2.6V7Z"
    />
  </svg>
);

const features = [
  {
    icon: <BarsIcon />,
    title: "Understand your skills",
    text: "We analyze your repositories to find languages, tools, and topics you work with.",
  },
  {
    icon: <SearchIcon />,
    title: "Discover relevant issues",
    text: "Get personalized open-source issues that match your skills and interests.",
  },
  {
    icon: <TrophyIcon />,
    title: "Track your progress",
    text: "Keep track of your contributions and see your growth over time.",
  },
];

export default function DevPathHero({ onAnalyze }) {
  return (
    <main className="dp">
      <header className="dp-nav">
       <VscGithub size={22} />

        <span className="dp-brand">DevPath</span>
      </header>

      <section className="dp-hero">
        <p className="dp-eyebrow">Open source a brighter tomorrow</p>

        <h1 className="dp-title">
          Find your next open-source
          <span className="dp-title-accent">contribution</span>
        </h1>

        <p className="dp-sub">
          See what you know, discover issues that fit and track your progress
        </p>

        <div className="dp-form-wrap">
          <div className="dp-note dp-note-left" aria-hidden="true">
            <svg viewBox="0 0 90 220" className="dp-doodle">
              <path d="M10 14 l3 14 M24 14 l-3 14" stroke="#f26b2a" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path
                d="M24 62 C 60 66, 78 78, 66 104 C 54 130, 10 140, 22 175 C 30 196, 55 205, 72 208"
                stroke="#f26b2a"
                strokeWidth="2"
                strokeDasharray="7 7"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <span>
              Learn
              <br />
              Contribute
              <br />
              Grow
            </span>
          </div>

          <div className="dp-form">
            <p className="dp-label">Connect your GitHub account</p>
            <button type="button" className="dp-btn" onClick={onAnalyze}>
              <VscGithub size={21} />
              Continue with GitHub
            </button>
            <p className="dp-privacy">
              <LockIcon />
              Sign in securely. Your profile details will be fetched by DevPath after authorization.
            </p>
          </div>
          <div className="dp-note dp-note-right" aria-hidden="true">
            <svg viewBox="0 0 140 220" className="dp-doodle">
              <path
                d="M118 8 C 90 16, 50 26, 26 52 C 4 78, 40 100, 58 118 C 76 138, 70 170, 40 190 L 14 208"
                stroke="#f26b2a"
                strokeWidth="2"
                strokeDasharray="7 7"
                strokeLinecap="round"
                fill="none"
              />
              <path d="M122 4 L100 8 L112 22 Z" fill="#f26b2a" stroke="#f26b2a" strokeWidth="2" strokeLinejoin="round" />
              <path d="M128 62 l-5 12 M136 70 l-14 4" stroke="#f26b2a" strokeWidth="2" strokeLinecap="round" fill="none" />
            </svg>
            <span>
              Small
              <br />
              contributions
              <br />
              make a big
              <br />
              difference
            </span>
          </div>
        </div>
      </section>

      <section className="dp-features">
        {features.map((f) => (
          <article key={f.title} className="dp-feature">
            <div className="dp-feature-head">
              <span className="dp-feature-icon">{f.icon}</span>
              <h2>{f.title}</h2>
            </div>
            <p>{f.text}</p>
          </article>
        ))}
      </section>

      <footer className="dp-footer">
        More curious developers. A more open tomorrow
      </footer>
    </main>
  );
}