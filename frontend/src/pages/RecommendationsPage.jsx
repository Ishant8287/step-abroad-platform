import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { getUser } from "../lib/auth";

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

  if (!user?.id) return <p>No active user.</p>;
  if (error) return <p className="error">{error}</p>;
  if (!result) return <p>Loading recommendations...</p>;

  return (
    <section>
      <div className="card">
        <h3>{result.student.fullName}'s Recommendations</h3>
        <p>Target Countries: {result.student.targetCountries?.join(", ") || "Not set"}</p>
        <p>Interested Fields: {result.student.interestedFields?.join(", ") || "Not set"}</p>
      </div>

      <div className="stack">
        {result.recommendations.map((item, index) => (
          <article key={`${item.title}-${index}`} className="card">
            <h4>{item.title} - {item.universityName}</h4>
            <p>{item.country} · {item.degreeLevel}</p>
            <p>Match Score: {item.matchScore}</p>
            <p>Tuition: ${item.tuitionFeeUsd}</p>
            <ul>{item.reasons?.map((r) => <li key={r}>{r}</li>)}</ul>
          </article>
        ))}
      </div>
    </section>
  );
}
