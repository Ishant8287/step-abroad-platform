import { useEffect, useState } from "react";
import { api } from "../lib/api";

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
    <section>
      <div className="filters">
        <input placeholder="Search title/field/university" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
        <input placeholder="Country" value={filters.country} onChange={(e) => setFilters({ ...filters, country: e.target.value })} />
        <select value={filters.degreeLevel} onChange={(e) => setFilters({ ...filters, degreeLevel: e.target.value })}>
          <option value="">Any Degree</option>
          <option value="bachelor">Bachelor</option>
          <option value="master">Master</option>
          <option value="diploma">Diploma</option>
          <option value="certificate">Certificate</option>
        </select>
        <input type="number" placeholder="Max tuition USD" value={filters.maxTuition} onChange={(e) => setFilters({ ...filters, maxTuition: e.target.value })} />
        <button onClick={load}>Apply Filters</button>
      </div>

      <div className="grid3">
        {programs.map((p) => (
          <article key={p._id} className="card">
            <h4>{p.title}</h4>
            <p>{p.universityName}</p>
            <p>{p.country} · {p.degreeLevel}</p>
            <p>Field: {p.field}</p>
            <p>Tuition: ${p.tuitionFeeUsd}</p>
            <p>Intakes: {p.intakes.join(", ") || "N/A"}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
