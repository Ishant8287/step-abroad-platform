import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../lib/api";
import { getUser } from "../lib/auth";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

/* ─── Match Score Ring ─────────────────────────────────────── */
function MatchRing({ score }) {
  const pct = Math.min(score, 100);
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div style={{ position: "relative", width: "80px", height: "80px", flexShrink: 0 }}>
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="36" fill="none" stroke="var(--border)" strokeWidth="5" />
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke="url(#gradient-ring)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 40 40)"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
        <defs>
          <linearGradient id="gradient-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-2)" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-heading)",
        fontWeight: 800,
        fontSize: "1rem",
      }}>
        {pct}
      </div>
    </div>
  );
}

export default function RecommendationsPage() {
  const user = getUser();
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    api.recommendations(user.id)
      .then((res) => setResult(res.data))
      .catch((err) => setError(err.message));
  }, [user?.id]);

  if (!user?.id) {
    return (
      <div className="glass-card-static p-lg" style={{ textAlign: "center" }}>
        <p style={{ color: "var(--text-secondary)" }}>No active user.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card-static p-lg">
        <p className="error-text">{error}</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col gap-md">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card-static p-lg">
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-text" />
            <div className="skeleton skeleton-text" style={{ width: "60%" }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
      {/* ─── Student Profile Banner ──────────────────────────── */}
      <motion.div
        className="glass-card-static p-lg"
        variants={fadeUp}
        style={{
          marginBottom: "28px",
          background: "linear-gradient(135deg, rgba(108,92,231,0.08), rgba(0,206,201,0.05))",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
        }}
      >
        <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "12px" }}>
          🎯 {result.student.fullName}'s Recommendations
        </h3>
        <div className="flex gap-lg flex-wrap" style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          <div>
            <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>Target Countries: </strong>
            {result.student.targetCountries?.length > 0
              ? result.student.targetCountries.map((c) => (
                  <span key={c} className="badge badge-teal" style={{ marginLeft: "6px" }}>{c}</span>
                ))
              : "Not set"
            }
          </div>
          <div>
            <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>Interested Fields: </strong>
            {result.student.interestedFields?.length > 0
              ? result.student.interestedFields.map((f) => (
                  <span key={f} className="badge badge-accent" style={{ marginLeft: "6px" }}>{f}</span>
                ))
              : "Not set"
            }
          </div>
        </div>
      </motion.div>

      {/* ─── Recommendation Cards ────────────────────────────── */}
      <div className="flex flex-col gap-md">
        {result.recommendations.map((item, index) => (
          <motion.article
            key={`${item.title}-${index}`}
            className="glass-card p-lg"
            variants={fadeUp}
            custom={index}
          >
            <div className="flex gap-lg" style={{ alignItems: "flex-start" }}>
              <MatchRing score={item.matchScore} />
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "6px" }}>
                  {item.title}
                </h4>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "8px" }}>
                  {item.universityName}
                </p>
                <div className="flex gap-sm flex-wrap" style={{ marginBottom: "12px" }}>
                  <span className="badge badge-teal">{item.country}</span>
                  <span className="badge badge-accent">{item.degreeLevel}</span>
                  <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                    ${item.tuitionFeeUsd?.toLocaleString()}
                  </span>
                </div>

                {item.reasons?.length > 0 && (
                  <div className="flex flex-col gap-xs">
                    {item.reasons.map((r) => (
                      <div key={r} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                        <span style={{ color: "var(--success)" }}>✓</span>
                        {r}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.article>
        ))}
        {result.recommendations.length === 0 && (
          <div className="glass-card-static p-lg" style={{ textAlign: "center" }}>
            <p style={{ color: "var(--text-secondary)" }}>No recommendations available yet. Update your profile to get matched.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
