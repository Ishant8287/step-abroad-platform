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

// Mirrors backend/src/config/constants.js — keep in sync
const validStatusTransitions = {
  draft: ["submitted"],
  submitted: ["under-review", "rejected"],
  "under-review": ["offer-received", "rejected"],
  "offer-received": ["visa-processing", "rejected"],
  "visa-processing": ["enrolled", "rejected"],
  enrolled: [],
  rejected: [],
};

const statusColors = {
  draft: "badge-info",
  submitted: "badge-accent",
  "under-review": "badge-warning",
  "offer-received": "badge-teal",
  "visa-processing": "badge-accent",
  enrolled: "badge-success",
  rejected: "badge-danger",
};

const statusSteps = ["draft", "submitted", "under-review", "offer-received", "visa-processing", "enrolled"];

function StatusProgress({ status }) {
  const currentIndex = statusSteps.indexOf(status);
  const isRejected = status === "rejected";

  return (
    <div className="flex gap-xs items-center" style={{ marginTop: "12px" }}>
      {statusSteps.map((step, i) => (
        <div
          key={step}
          style={{
            flex: 1,
            height: "4px",
            borderRadius: "4px",
            background: isRejected
              ? "var(--danger)"
              : i <= currentIndex
                ? "linear-gradient(90deg, var(--accent), var(--accent-2))"
                : "var(--border)",
            transition: "background 0.3s ease",
          }}
          title={step}
        />
      ))}
    </div>
  );
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [programId, setProgramId] = useState("");
  const [intake, setIntake] = useState("Fall 2026");
  const [createMessage, setCreateMessage] = useState("");
  const [cardErrors, setCardErrors] = useState({});

  const load = async () => {
    try {
      const res = await api.applications();
      setApplications(res.data);
    } catch (err) {
      setCreateMessage(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    setCreateMessage("");
    try {
      await api.createApplication({ programId, intake });
      setProgramId("");
      setCreateMessage("Application created successfully.");
      await load();
    } catch (err) {
      setCreateMessage(err.message);
    }
  };

  const updateStatus = async (id, status) => {
    setCardErrors((prev) => ({ ...prev, [id]: "" }));
    try {
      await api.updateApplicationStatus(id, { status });
      await load();
    } catch (err) {
      setCardErrors((prev) => ({ ...prev, [id]: err.message }));
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
      {/* ─── Create Form ─────────────────────────────────────── */}
      <motion.form className="glass-card-static p-lg" onSubmit={create} variants={fadeUp} style={{ marginBottom: "28px" }}>
        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "16px" }}>✏️ Create New Application</h3>
        <div className="flex gap-sm flex-wrap">
          <input
            className="input"
            placeholder="Program ID"
            value={programId}
            onChange={(e) => setProgramId(e.target.value)}
            required
            style={{ flex: "2 1 200px" }}
          />
          <input
            className="input"
            placeholder="Intake (e.g. Fall 2026)"
            value={intake}
            onChange={(e) => setIntake(e.target.value)}
            required
            style={{ flex: "1 1 160px" }}
          />
          <button className="btn btn-primary" type="submit">Create</button>
        </div>
        {createMessage && (
          <motion.p
            className={createMessage.includes("successfully") ? "badge badge-success mt-sm" : "error-text mt-sm"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: "inline-block" }}
          >
            {createMessage}
          </motion.p>
        )}
      </motion.form>

      {/* ─── Applications List ───────────────────────────────── */}
      <div className="flex flex-col gap-md">
        {applications.map((a, i) => {
          const allowed = validStatusTransitions[a.status] || [];
          return (
            <motion.article
              key={a._id}
              className="glass-card p-lg"
              variants={fadeUp}
              custom={i}
              layout
            >
              <div className="flex items-center justify-between flex-wrap gap-sm" style={{ marginBottom: "12px" }}>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 700 }}>
                  {a.program?.title || a.program}
                </h4>
                <span className={`badge ${statusColors[a.status] || "badge-info"}`}>{a.status}</span>
              </div>

              <div className="flex gap-lg flex-wrap" style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
                <span>👤 {a.student?.fullName}</span>
                <span>🌍 {a.destinationCountry}</span>
                <span>📅 {a.intake}</span>
              </div>

              <StatusProgress status={a.status} />

              {allowed.length > 0 ? (
                <div className="flex gap-sm flex-wrap" style={{ marginTop: "16px" }}>
                  {allowed.map((status) => (
                    <button
                      key={status}
                      type="button"
                      className={`btn btn-sm ${status === "rejected" ? "btn-danger" : "btn-secondary"}`}
                      onClick={() => updateStatus(a._id, status)}
                    >
                      → {status}
                    </button>
                  ))}
                </div>
              ) : (
                <p style={{ color: "var(--text-tertiary)", fontSize: "0.82rem", marginTop: "12px" }}>
                  No further transitions available.
                </p>
              )}

              {cardErrors[a._id] && (
                <p className="error-text mt-sm">{cardErrors[a._id]}</p>
              )}
            </motion.article>
          );
        })}
        {applications.length === 0 && (
          <div className="glass-card-static p-lg" style={{ textAlign: "center" }}>
            <p style={{ color: "var(--text-secondary)" }}>No applications yet. Create your first one above.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
