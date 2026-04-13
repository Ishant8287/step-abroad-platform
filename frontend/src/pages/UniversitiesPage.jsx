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

export default function UniversitiesPage() {
  const [popular, setPopular] = useState([]);
  const [list, setList] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    api.popularUniversities().then((r) => setPopular(r.data));
    load();
  }, []);

  const load = async () => {
    const res = await api.universities({ q, limit: 12, sortBy: "popular" });
    setList(res.data);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") load();
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
      {/* ─── Search ─────────────────────────────────────────── */}
      <motion.div className="flex gap-sm" style={{ marginBottom: "32px" }} variants={fadeUp}>
        <div style={{ position: "relative", flex: 1 }}>
          <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-tertiary)", fontSize: "1.1rem" }}>🔍</span>
          <input
            className="input"
            placeholder="Search university, country, or city..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ paddingLeft: "44px" }}
          />
        </div>
        <button className="btn btn-primary" onClick={load}>Search</button>
      </motion.div>

      {/* ─── Popular Universities ────────────────────────────── */}
      {popular.length > 0 && (
        <>
          <motion.h3 variants={fadeUp} style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px" }}>
            🔥 Popular Universities
          </motion.h3>
          <div className="grid grid-3 gap-md" style={{ marginBottom: "40px" }}>
            {popular.map((u, i) => (
              <motion.article key={u._id} className="glass-card p-md" variants={fadeUp} custom={i} whileHover={{ y: -4 }}>
                <h4 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "8px" }}>{u.name}</h4>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: "8px" }}>📍 {u.city}, {u.country}</p>
                <span className="badge badge-accent">
                  QS Rank: {u.qsRanking || "N/A"}
                </span>
              </motion.article>
            ))}
          </div>
        </>
      )}

      {/* ─── All Universities ────────────────────────────────── */}
      <motion.h3 variants={fadeUp} style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px" }}>
        🏛️ All Universities
      </motion.h3>
      <div className="grid grid-3 gap-md">
        {list.map((u, i) => (
          <motion.article key={u._id} className="glass-card p-md" variants={fadeUp} custom={i} whileHover={{ y: -4 }}>
            <h4 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "8px" }}>{u.name}</h4>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: "8px" }}>📍 {u.city}, {u.country}</p>
            <div className="flex gap-xs flex-wrap">
              <span className="badge badge-teal">{u.partnerType}</span>
              {u.scholarshipAvailable && <span className="badge badge-success">💰 Scholarship</span>}
            </div>
          </motion.article>
        ))}
        {list.length === 0 && (
          <div className="glass-card-static p-lg" style={{ gridColumn: "1 / -1", textAlign: "center" }}>
            <p style={{ color: "var(--text-secondary)" }}>No universities found. Try a different search.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
