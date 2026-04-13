import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { api } from "../lib/api";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

function AnimatedNumber({ value }) {
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current || hasAnimated.current || value === undefined) return;
    hasAnimated.current = true;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: value,
      duration: 1.8,
      ease: "power2.out",
      onUpdate: () => {
        ref.current.textContent = Math.floor(obj.val).toLocaleString();
      },
    });
  }, [value]);

  return <span ref={ref}>0</span>;
}

/* ─── Skeleton Loader ──────────────────────────────────────── */
function DashboardSkeleton() {
  return (
    <div className="grid grid-3 gap-md" style={{ marginBottom: "20px" }}>
      {[1,2,3].map((i) => (
        <div key={i} className="glass-card-static p-lg">
          <div className="skeleton skeleton-text" style={{ width: "40%" }} />
          <div className="skeleton skeleton-title" style={{ width: "60%", marginTop: "12px" }} />
        </div>
      ))}
    </div>
  );
}

const statusColors = {
  draft: "badge-info",
  submitted: "badge-accent",
  "under-review": "badge-warning",
  "offer-received": "badge-teal",
  "visa-processing": "badge-accent",
  enrolled: "badge-success",
  rejected: "badge-danger",
};

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.dashboard()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="glass-card-static p-lg"><p className="error-text">{error}</p></div>;
  if (!data) return <DashboardSkeleton />;

  const statCards = [
    { label: "Total Students", value: data.totalStudents, icon: "👨‍🎓", color: "feature-icon-purple" },
    { label: "Total Programs", value: data.totalPrograms, icon: "📋", color: "feature-icon-teal" },
    { label: "Total Applications", value: data.totalApplications, icon: "📄", color: "feature-icon-orange" },
  ];

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
      {/* ─── Stat Cards ──────────────────────────────────────── */}
      <div className="grid grid-3 gap-md" style={{ marginBottom: "24px" }}>
        {statCards.map((card, i) => (
          <motion.div key={card.label} className="glass-card p-lg" variants={fadeUp} custom={i}>
            <div className="flex items-center justify-between" style={{ marginBottom: "16px" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 500 }}>{card.label}</span>
              <div className={`feature-icon ${card.color}`} style={{ width: "40px", height: "40px", fontSize: "1.2rem", marginBottom: 0 }}>
                {card.icon}
              </div>
            </div>
            <div style={{ fontSize: "2.2rem", fontFamily: "var(--font-heading)", fontWeight: 800 }}>
              <AnimatedNumber value={card.value} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* ─── Bottom Row ──────────────────────────────────────── */}
      <div className="grid grid-2 gap-md">
        {/* Top Countries */}
        <motion.div className="glass-card-static p-lg" variants={fadeUp} custom={3}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "16px" }}>🌍 Top Destination Countries</h3>
          <div className="flex flex-wrap gap-sm">
            {data.topCountries.map((item) => (
              <span key={item._id} className="badge badge-teal" style={{ padding: "6px 14px", fontSize: "0.82rem" }}>
                {item._id} — {item.count}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Status Breakdown */}
        <motion.div className="glass-card-static p-lg" variants={fadeUp} custom={4}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "16px" }}>📊 Status Breakdown</h3>
          <div className="flex flex-col gap-sm">
            {data.statusBreakdown.map((item) => (
              <div key={item._id} className="flex items-center justify-between" style={{ padding: "8px 0" }}>
                <span className={`badge ${statusColors[item._id] || "badge-info"}`}>{item._id}</span>
                <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.1rem" }}>{item.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
