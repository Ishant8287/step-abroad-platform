import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { getToken } from "../lib/auth";
import "./LandingPage.css";

/* ── Animation variants ─────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ── Counter hook ────────────────────────────────────────────── */
function AnimatedCounter({ target, suffix = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView || !ref.current) return;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => {
        ref.current.textContent = Math.floor(obj.val).toLocaleString() + suffix;
      },
    });
  }, [isInView, target, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

/* ── Section wrapper with scroll reveal ──────────────────────── */
function RevealSection({ children, className = "", id }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={stagger}
    >
      {children}
    </motion.section>
  );
}

/* ─── Features data ──────────────────────────────────────────── */
const features = [
  {
    icon: "🎓",
    title: "Smart University Matching",
    desc: "AI-powered algorithm matches you with the best universities based on your profile, preferences, and academic goals.",
  },
  {
    icon: "🌎",
    title: "50+ Countries",
    desc: "Explore study programs across 50+ countries with detailed info on tuition, scholarships, and living costs.",
  },
  {
    icon: "📋",
    title: "Application Tracker",
    desc: "Track every application from draft to enrollment with real-time status updates and deadline reminders.",
  },
  {
    icon: "💡",
    title: "Personalized Recommendations",
    desc: "Get tailored program suggestions based on your field of study, budget, and preferred destinations.",
  },
  {
    icon: "📊",
    title: "Analytics Dashboard",
    desc: "Beautiful dashboards showing your progress, application stats, and insights at a glance.",
  },
  {
    icon: "🛡️",
    title: "Visa & Document Support",
    desc: "Step-by-step guidance through visa processing and document requirements for your destination country.",
  },
];

/* ═══════════════════════════════════════════════════════════════
   LandingPage Component
   ═══════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const isLoggedIn = !!getToken();

  /* ── Scroll listener for nav ─────────────────────────────── */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="landing-page">
      {/* ═══ NAVBAR ═══ */}
      <nav className={`landing-nav ${scrolled ? "landing-nav-scrolled" : ""}`}>
        <Link to="/" className="landing-logo">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#2563eb" />
            <path d="M2 17L12 22L22 17" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          StepAbroad
        </Link>

        <div className="landing-nav-links">
          <Link to="/universities">Universities</Link>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
        </div>

        <div className="landing-nav-actions">
          {isLoggedIn ? (
            <Link to="/dashboard" className="btn-primary" style={{ padding: '10px 20px', borderRadius: '8px', textDecoration: 'none' }}>Dashboard →</Link>
          ) : (
            <>
              <Link to="/login" style={{ fontWeight: 600, color: '#4b5563', textDecoration: 'none', marginRight: '16px' }}>Log in</Link>
              <Link to="/register" className="btn-primary" style={{ padding: '10px 20px', borderRadius: '8px', textDecoration: 'none' }}>Get Started</Link>
            </>
          )}
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="hero">
        <motion.div
          className="hero-content"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div className="hero-badge" variants={fadeUp}>
            <span className="hero-badge-dot" />
            Trusted by 10,000+ students worldwide
          </motion.div>

          <motion.h1 className="hero-title" variants={fadeUp}>
            Your <span className="gradient-text">Global Education</span><br/>
            Journey Starts Here
          </motion.h1>

          <motion.p className="hero-subtitle" variants={fadeUp} custom={1}>
            Discover top universities, track applications, and get AI-powered
            recommendations — all in one beautifully crafted platform.
          </motion.p>

          <motion.div className="hero-cta" variants={fadeUp} custom={2}>
            <Link to={isLoggedIn ? "/dashboard" : "/register"} className="btn-primary">
              Start Exploring →
            </Link>
            <a href="#how-it-works" className="btn-secondary">
              See How It Works
            </a>
          </motion.div>
        </motion.div>

        <motion.div 
          className="hero-image-wrapper"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <img src="/assets/landing_illustration.png" alt="Study Abroad Global Journey" />
        </motion.div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <RevealSection className="stats-bar" id="stats">
        {[
          { target: 10000, suffix: "+", label: "Students" },
          { target: 500, suffix: "+", label: "Universities" },
          { target: 50, suffix: "+", label: "Countries" },
          { target: 95, suffix: "%", label: "Success Rate" },
        ].map((s, i) => (
          <motion.div key={s.label} className="stat-item" variants={fadeUp} custom={i}>
            <div className="stat-number">
              <AnimatedCounter target={s.target} suffix={s.suffix} />
            </div>
            <div className="stat-label">{s.label}</div>
          </motion.div>
        ))}
      </RevealSection>

      {/* ═══ FEATURES ═══ */}
      <RevealSection className="section" id="features">
        <motion.div variants={fadeUp}>
          <span className="section-label">Why StepAbroad</span>
          <h2 className="section-title">Everything you need to<br />study abroad, simplified.</h2>
          <p className="section-subtitle">
            From university discovery to visa processing — we've built the
            tools that make studying abroad effortless.
          </p>
        </motion.div>

        <div className="features-grid">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="feature-card"
              variants={fadeUp}
              custom={i}
            >
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </RevealSection>

      {/* ═══ HOW IT WORKS ═══ */}
      <RevealSection className="section" id="how-it-works">
        <motion.div variants={fadeUp}>
          <span className="section-label">How It Works</span>
          <h2 className="section-title">Three steps to your<br />dream university.</h2>
        </motion.div>

        <div className="steps-container">
          {[
            { num: 1, title: "Create Your Profile", desc: "Sign up and tell us about your academic background, target countries, and field of interest." },
            { num: 2, title: "Discover & Match", desc: "Browse 500+ universities and get AI-powered recommendations tailored to your goals." },
            { num: 3, title: "Apply & Track", desc: "Submit applications directly and track every stage from submission to enrolled." },
          ].map((step, i) => (
            <motion.div key={step.num} className="step-item" variants={fadeUp} custom={i}>
              <div className="step-number">{step.num}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </RevealSection>

      {/* ═══ CTA ═══ */}
      <section className="section">
        <div className="cta-section">
          <div className="cta-content">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              Ready to start your global journey?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              Join 10,000+ students who are already discovering their dream
              universities. It's free to get started.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <Link to="/register" className="btn-primary">
                Create Free Account →
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="landing-footer">
        <div className="footer-grid">
          <div>
            <div className="landing-logo" style={{ marginBottom: "16px" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#2563eb" />
                <path d="M2 17L12 22L22 17" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              StepAbroad
            </div>
            <p className="footer-brand-desc">
              Your intelligent companion for studying abroad. Discover, apply,
              and succeed — all in one place.
            </p>
          </div>
          <div className="footer-col">
            <h4>Platform</h4>
            <Link to="/universities">Universities</Link>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <a href="#">Blog</a>
            <a href="#">Guides</a>
            <a href="#">Help Center</a>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 StepAbroad. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="#">Twitter</a>
            <a href="#">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
