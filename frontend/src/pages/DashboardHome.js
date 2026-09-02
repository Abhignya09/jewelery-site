import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const steps = [
  {
    icon: "✏️",
    title: "1. Sketch",
    desc: "Upload a hand-drawn or digital sketch of your jewelry idea in the Design Studio.",
  },
  {
    icon: "🧠",
    title: "2. AI Processing (GAN)",
    desc: "A Generative Adversarial Network (served by a Flask microservice) analyzes the sketch's shape, contours and style.",
  },
  {
    icon: "✨",
    title: "3. Gold Rendering",
    desc: "The model generates a realistic 3D gold-finish render of your design, complete with texture and shine.",
  },
  {
    icon: "📚",
    title: "4. Save & Review",
    desc: "Every sketch and its generated render is saved to your account and viewable anytime in History.",
  },
];

const DashboardHome = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>Welcome, {user?.name} 👋</h1>
      <p className="dashboard-intro">
        Jewel AI turns your rough jewelry sketches into realistic 3D gold renders using AI. Here's
        how the process works end to end:
      </p>

      <div className="steps-grid">
        {steps.map((s) => (
          <div className="step-card" key={s.title}>
            <div className="step-icon">{s.icon}</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="cta-row">
        <Link to="/dashboard/design" className="cta-btn">
          Start a New Design
        </Link>
        <Link to="/dashboard/history" className="cta-btn secondary">
          View My History
        </Link>
      </div>
    </div>
  );
};

export default DashboardHome;
