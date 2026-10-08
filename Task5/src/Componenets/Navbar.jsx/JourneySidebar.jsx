import { VscGithub } from "react-icons/vsc";
import { FiPower } from "react-icons/fi";
import { FaRegCircle, FaCircle } from "react-icons/fa";
import journey from "./journey";
import "./JourneySidebar.css";

export default function JourneySidebar({ activeStep, onSelect, onLogout }) {
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      onLogout();
    }
  };

  return (
    <aside className="devpath-sidebar">
      <div>
        <div className="devpath-sidebar-logo">
          <VscGithub size={22} />
          <span>DevPath</span>
        </div>

        <p className="devpath-journey-label">YOUR JOURNEY</p>
        <ul className="devpath-steps">
          {journey.map((step, index) => (
            <li key={step.title}>
              <button
                type="button"
                className={`devpath-step ${activeStep === index ? "active" : ""}`}
                aria-current={activeStep === index ? "step" : undefined}
                aria-controls={step.target}
                onClick={() => onSelect(index)}
              >
                <span className="devpath-step-icon">
                  {activeStep === index ? <FaCircle /> : <FaRegCircle />}
                </span>
                <span>
                  <span className="devpath-step-title">{step.title}</span>
                  <span className="devpath-step-sub">{step.sub}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <hr className="devpath-sidebar-divider" />
        <p className="devpath-sidebar-tagline">
          A clearer path
          <span>from curious to shipped.</span>
        </p>
      </div>

      <button className="devpath-sidebar-logout" type="button" onClick={handleLogout}>
        <FiPower /> Log Out
      </button>
    </aside>
  );
}
