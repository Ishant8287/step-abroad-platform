import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../lib/api";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const degreeBadgeColors = {
  bachelor: "badge-accent",
  master: "badge-teal",
  diploma: "badge-warning",
  certificate: "badge-info",
};

export default function ProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [filters, setFilters] = useState({ q: "", country: "", degreeLevel: "", maxTuition: "" });

  const load = async () => {
    const res = await api.programs({ ...filters, limit: 15 });
    setPrograms(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
      {/* ─── Filters ─────────────────────────────────────────── */}
      <motion.div className="flex gap-sm flex-wrap" style={{ marginBottom: "32px" }} variants={fadeUp}>
        <input
          className="input"
          placeholder="Search title, field, or university..."
          value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          style={{ flex: "2 1 200px" }}
        />
        <input
          className="input"
          placeholder="Country"
          value={filters.country}
          onChange={(e) => setFilters({ ...filters, country: e.target.value })}
          style={{ flex: "1 1 120px" }}
        />
        <select
          className="input select"
          value={filters.degreeLevel}
          onChange={(e) => setFilters({ ...filters, degreeLevel: e.target.value })}
          style={{ flex: "1 1 120px" }}
        >
          <option value="">Any Degree</option>
          <option value="bachelor">Bachelor</option>
          <option value="master">Master</option>
          <option value="diploma">Diploma</option>
          <option value="certificate">Certificate</option>
        </select>
        <input
          className="input"
          type="number"
          placeholder="Max tuition USD"
          value={filters.maxTuition}
          onChange={(e) => setFilters({ ...filters, maxTuition: e.target.value })}
          style={{ flex: "1 1 140px" }}
        />
        <button className="btn btn-primary" onClick={load}>Apply Filters</button>
      </motion.div>

      {/* ─── Programs Grid ───────────────────────────────────── */}
      <div className="grid grid-3 gap-md">
        {programs.map((p, i) => (
          <motion.article key={p._id} className="glass-card p-md" variants={fadeUp} custom={i} whileHover={{ y: -4 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: "10px" }}>
              <span className={`badge ${degreeBadgeColors[p.degreeLevel] || "badge-info"}`}>
                {p.degreeLevel}
              </span>
              <span style={{ fontSize: "0.78rem", color: "var(--text-tertiary)" }}>{p.country}</span>
            </div>
            <h4 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "6px" }}>{p.title}</h4>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "10px" }}>{p.universityName}</p>
            <p style={{ fontSize: "0.82rem", color: "var(--text-tertiary)", marginBottom: "10px" }}>
              📚 {p.field}
            </p>
            <div className="flex items-center justify-between" style={{ borderTop: "1px solid var(--border)", paddingTop: "10px" }}>
              <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.05rem" }}>
                ${p.tuitionFeeUsd?.toLocaleString()}
              </span>
              <div className="flex gap-xs flex-wrap">
                {p.intakes?.slice(0, 2).map((intake) => (
                  <span key={intake} className="badge badge-success" style={{ fontSize: "0.7rem" }}>
                    {intake}
                  </span>
                ))}
              </div>
            </div>
          </motion.article>
        ))}
        {programs.length === 0 && (
          <div className="glass-card-static p-lg" style={{ gridColumn: "1 / -1", textAlign: "center" }}>
            <p style={{ color: "var(--text-secondary)" }}>No programs found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
