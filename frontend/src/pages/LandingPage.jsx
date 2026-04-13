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
    iconClass: "feature-icon-purple",
    title: "Smart University Matching",
    desc: "AI-powered algorithm matches you with the best universities based on your profile, preferences, and academic goals.",
  },
  {
    icon: "🌎",
    iconClass: "feature-icon-teal",
    title: "50+ Countries",
    desc: "Explore study programs across 50+ countries with detailed info on tuition, scholarships, and living costs.",
  },
  {
    icon: "📋",
    iconClass: "feature-icon-orange",
    title: "Application Tracker",
    desc: "Track every application from draft to enrollment with real-time status updates and deadline reminders.",
  },
  {
    icon: "💡",
    iconClass: "feature-icon-green",
    title: "Personalized Recommendations",
    desc: "Get tailored program suggestions based on your field of study, budget, and preferred destinations.",
  },
  {
    icon: "📊",
    iconClass: "feature-icon-blue",
    title: "Analytics Dashboard",
    desc: "Beautiful dashboards showing your progress, application stats, and insights at a glance.",
  },
  {
    icon: "🛡️",
    iconClass: "feature-icon-pink",
    title: "Visa & Document Support",
    desc: "Step-by-step guidance through visa processing and document requirements for your destination country.",
  },
];

const testimonials = [
  {
    text: "StudyVerse made my dream of studying at the University of Toronto a reality. The AI recommendations were spot-on!",
    name: "Priya Sharma",
    role: "MS Computer Science, UofT",
    initials: "PS",
  },
  {
    text: "I applied to 5 universities and got into 3 — all thanks to the smart matching and application tracking features.",
    name: "Ahmed Hassan",
    role: "MBA, London Business School",
    initials: "AH",
  },
  {
    text: "The visa processing guidance saved me so much time and stress. I couldn't have done it without StudyVerse.",
    name: "Maria Garcia",
    role: "B.Eng, TU Munich",
    initials: "MG",
  },
];

/* ═══════════════════════════════════════════════════════════════
   LandingPage Component
   ═══════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);
  const isLoggedIn = !!getToken();

  /* ── Scroll listener for nav ─────────────────────────────── */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ── GSAP hero title animation ───────────────────────────── */
  useEffect(() => {
    if (!heroRef.current) return;
    const tl = gsap.timeline();
    tl.fromTo(
      heroRef.current.querySelectorAll(".hero-word"),
      { opacity: 0, y: 60, rotationX: -40 },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
      }
    );
  }, []);

  return (
    <div className="landing-page">
      {/* ═══ NAVBAR ═══ */}
      <nav className={`landing-nav ${scrolled ? "landing-nav-scrolled" : ""}`}>
        <Link to="/" className="landing-logo">
          <span className="landing-logo-icon">✦</span>
          StudyVerse
        </Link>

        <div className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#testimonials">Testimonials</a>
        </div>

        <div className="landing-nav-actions">
          {isLoggedIn ? (
            <Link to="/dashboard" className="btn btn-primary btn-sm">Dashboard →</Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="hero" ref={heroRef}>
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
        </div>

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

          <h1 className="hero-title">
            <span className="hero-word">Your </span>
            <span className="hero-word gradient-text">Global Education </span>
            <span className="hero-word">Journey </span>
            <span className="hero-word">Starts </span>
            <span className="hero-word">Here</span>
          </h1>

          <motion.p className="hero-subtitle" variants={fadeUp} custom={3}>
            Discover top universities, track applications, and get AI-powered
            recommendations — all in one beautifully crafted platform.
          </motion.p>

          <motion.div className="hero-cta" variants={fadeUp} custom={4}>
            <Link to={isLoggedIn ? "/dashboard" : "/register"} className="btn btn-primary">
              Start Exploring →
            </Link>
            <a href="#features" className="btn btn-secondary">
              See How It Works
            </a>
          </motion.div>
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
            <div className="stat-number gradient-text">
              <AnimatedCounter target={s.target} suffix={s.suffix} />
            </div>
            <div className="stat-label">{s.label}</div>
          </motion.div>
        ))}
      </RevealSection>

      {/* ═══ FEATURES ═══ */}
      <RevealSection className="section" id="features">
        <motion.div variants={fadeUp}>
          <span className="section-label">✦ Why StudyVerse</span>
          <h2 className="section-title">Everything you need to<br /><span className="gradient-text">study abroad, simplified.</span></h2>
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
              whileHover={{ y: -6 }}
            >
              <div className={`feature-icon ${f.iconClass}`}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </RevealSection>

      {/* ═══ HOW IT WORKS ═══ */}
      <RevealSection className="section" id="how-it-works">
        <motion.div variants={fadeUp}>
          <span className="section-label">✦ How It Works</span>
          <h2 className="section-title">Three steps to your<br /><span className="gradient-text">dream university.</span></h2>
          <p className="section-subtitle">
            We've streamlined the entire study abroad process into three simple steps.
          </p>
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

      {/* ═══ TESTIMONIALS ═══ */}
      <RevealSection className="section" id="testimonials">
        <motion.div variants={fadeUp}>
          <span className="section-label">✦ Testimonials</span>
          <h2 className="section-title">Loved by students<br /><span className="gradient-text">around the world.</span></h2>
          <p className="section-subtitle">
            Hear from students who transformed their study abroad journey with StudyVerse.
          </p>
        </motion.div>

        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="testimonial-card"
              variants={fadeUp}
              custom={i}
            >
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.initials}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </RevealSection>

      {/* ═══ CTA ═══ */}
      <section className="section">
        <div className="cta-section">
          <div className="cta-bg" />
          <div className="cta-content">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              Ready to start your <span className="gradient-text">global journey?</span>
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
              <Link to="/register" className="btn btn-primary" style={{ padding: "16px 40px", fontSize: "1rem", borderRadius: "28px" }}>
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
            <div className="landing-logo" style={{ marginBottom: "4px" }}>
              <span className="landing-logo-icon">✦</span>
              StudyVerse
            </div>
            <p className="footer-brand-desc">
              Your AI-powered companion for studying abroad. Discover, apply,
              and succeed — all in one place.
            </p>
          </div>
          <div className="footer-col">
            <h4>Platform</h4>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#testimonials">Reviews</a>
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
          <span>© 2026 StudyVerse. All rights reserved.</span>
          <div className="footer-socials">
            <a href="#" aria-label="Twitter">𝕏</a>
            <a href="#" aria-label="LinkedIn">in</a>
            <a href="#" aria-label="GitHub">⌂</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
