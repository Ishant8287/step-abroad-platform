import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.dashboard().then((res) => setData(res.data)).catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!data) return <p>Loading dashboard...</p>;

  return (
    <section className="grid2">
      <div className="card"><h3>Total Students</h3><p className="big">{data.totalStudents}</p></div>
      <div className="card"><h3>Total Programs</h3><p className="big">{data.totalPrograms}</p></div>
      <div className="card"><h3>Total Applications</h3><p className="big">{data.totalApplications}</p></div>
      <div className="card">
        <h3>Top Destination Countries</h3>
        <ul>{data.topCountries.map((item) => <li key={item._id}>{item._id}: {item.count}</li>)}</ul>
      </div>
      <div className="card span2">
        <h3>Status Breakdown</h3>
        <ul>{data.statusBreakdown.map((item) => <li key={item._id}>{item._id}: {item.count}</li>)}</ul>
      </div>
    </section>
  );
}
