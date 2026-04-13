import { useEffect, useState } from "react";
import { api } from "../lib/api";

const nextStatusChoices = ["submitted", "under-review", "offer-received", "visa-processing", "enrolled", "rejected"];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [programId, setProgramId] = useState("");
  const [intake, setIntake] = useState("Fall 2026");
  const [message, setMessage] = useState("");

  const load = async () => {
    const res = await api.applications();
    setApplications(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.createApplication({ programId, intake });
      setProgramId("");
      setMessage("Application created");
      await load();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.updateApplicationStatus(id, { status });
      await load();
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <section>
      <form className="card" onSubmit={create}>
        <h3>Create Application</h3>
        <input placeholder="Program ID" value={programId} onChange={(e) => setProgramId(e.target.value)} required />
        <input placeholder="Intake" value={intake} onChange={(e) => setIntake(e.target.value)} required />
        <button>Create</button>
        {message && <p>{message}</p>}
      </form>

      <div className="stack">
        {applications.map((a) => (
          <article key={a._id} className="card">
            <h4>{a.program?.title || a.program}</h4>
            <p>Student: {a.student?.fullName}</p>
            <p>Country: {a.destinationCountry}</p>
            <p>Intake: {a.intake}</p>
            <p>Status: <strong>{a.status}</strong></p>
            <div className="status-grid">
              {nextStatusChoices.map((status) => (
                <button key={status} type="button" onClick={() => updateStatus(a._id, status)}>{status}</button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
