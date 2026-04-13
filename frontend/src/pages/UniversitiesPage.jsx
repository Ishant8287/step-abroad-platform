import { useEffect, useState } from "react";
import { api } from "../lib/api";

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

  return (
    <section>
      <div className="filters">
        <input placeholder="Search university/country/city" value={q} onChange={(e) => setQ(e.target.value)} />
        <button onClick={load}>Search</button>
      </div>

      <h3>Popular Universities</h3>
      <div className="grid3">{popular.map((u) => <article key={u._id} className="card"><h4>{u.name}</h4><p>{u.city}, {u.country}</p><p>QS Rank: {u.qsRanking || "N/A"}</p></article>)}</div>

      <h3>All Universities</h3>
      <div className="grid3">{list.map((u) => <article key={u._id} className="card"><h4>{u.name}</h4><p>{u.city}, {u.country}</p><p>Partner: {u.partnerType}</p><p>Scholarship: {u.scholarshipAvailable ? "Yes" : "No"}</p></article>)}</div>
    </section>
  );
}
