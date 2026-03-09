import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

import "../styles/Pricing.css";

const pricingPlans = [
  {
    name: "Starter Pack",
    interviews: "10 interviews",
    originalPrice: "Rs 500",
    discountedPrice: "Rs 199",
    description: "For small hiring bursts and trial interview pipelines.",
    accentClass: "pricing-card--starter",
    badge: "Discounted",
  },
  {
    name: "Scale Pack",
    interviews: "100 interviews",
    originalPrice: "Rs 5000",
    discountedPrice: "Rs 3499",
    description: "For active recruiters running role-based AI assessments at volume.",
    accentClass: "pricing-card--scale",
    badge: "Best Value",
  },
  {
    name: "Custom Plan",
    interviews: "Custom interviews",
    originalPrice: null,
    discountedPrice: "Contact us",
    description: "Tailored interview counts, custom workflows, and higher-volume support.",
    accentClass: "pricing-card--custom",
    badge: "Enterprise",
  },
];

export default function Pricing() {
  return (
    <>
      <Navbar />
      <div className="pricing-page">
        <header className="pricing-nav glass-panel glass-panel--subtle">
          <Link to="/" className="pricing-brand">
            MeetPro
          </Link>

        <div className="pricing-nav-actions">
          <Link to="/login" className="btn-ghost pricing-nav-link">
            Login
          </Link>

          <Link to="/signup" className="btn-primary pricing-nav-link">
            Signup
          </Link>
        </div>
      </header>

      <main className="pricing-hero">
        <div className="pricing-copy">
          <span className="pricing-eyebrow">AI Interview Pricing</span>
          <h1>Choose the interview volume that fits your hiring cycle.</h1>
          <p>
            Unlock AI-led screening rounds with discounted pricing for teams that
            need fast candidate evaluation without manual scheduling overhead.
          </p>
        </div>

        <section className="pricing-grid" aria-label="Pricing plans">
          {pricingPlans.map((plan) => {
            const isCustomPlan = plan.name === "Custom Plan";

            return (
              <article
                key={plan.name}
                className={`pricing-card glass-panel glass-panel--strong ambient-glow ${plan.accentClass}`}
              >
                <div className="pricing-card-top">
                  <span className="pricing-badge">{plan.badge}</span>
                  <h2>{plan.name}</h2>
                  <p className="pricing-volume">{plan.interviews}</p>
                </div>

                <p className="pricing-description">{plan.description}</p>

                <div className="pricing-amounts">
                  {plan.originalPrice ? (
                    <span className="pricing-original">{plan.originalPrice}</span>
                  ) : (
                    <span className="pricing-original pricing-original--empty">
                      Flexible pricing
                    </span>
                  )}

                  <strong className="pricing-discounted">{plan.discountedPrice}</strong>
                </div>

                {isCustomPlan ? (
                  <a
                    className="btn-glow pricing-cta"
                    href="mailto:support@meetpro.ai?subject=Custom%20AI%20Interview%20Plan"
                  >
                    Contact Us
                  </a>
                ) : (
                  <Link to="/signup" className="btn-primary pricing-cta">
                    Join Us!
                  </Link>
                )}
              </article>
            );
          })}
        </section>
      </main>
    </div>
    </>
  );
}