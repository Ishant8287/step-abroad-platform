import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { getUser } from "../lib/auth";
import "./DashboardPage.css";

/* ─── Skeleton Loader ──────────────────────────────────────── */
function DashboardSkeleton() {
  return (
    <div className="skeleton-wrapper" style={{ padding: "24px" }}>
      <div className="grid grid-4 gap-md" style={{ marginBottom: "32px" }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="dashboard-card" style={{ height: "120px" }}>
            <div className="skeleton skeleton-text" style={{ width: "40%" }} />
            <div className="skeleton skeleton-title" style={{ width: "60%", marginTop: "12px" }} />
          </div>
        ))}
      </div>
      <div className="dashboard-card" style={{ height: "300px" }}></div>
    </div>
  );
}

/* ─── Status Badges ────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const map = {
    draft: { text: "Draft", class: "status-badge-gray" },
    submitted: { text: "Submitted", class: "status-badge-blue" },
    "under-review": { text: "Under Review", class: "status-badge-yellow" },
    "offer-received": { text: "Offer Received", class: "status-badge-green" },
    "visa-processing": { text: "Visa Processing", class: "status-badge-purple" },
    enrolled: { text: "Enrolled", class: "status-badge-teal" },
    rejected: { text: "Rejected", class: "status-badge-red" },
  };
  const badge = map[status] || map.draft;
  return <span className={`status-badge ${badge.class}`}>{badge.text}</span>;
};

/* ═══════════════════════════════════════════════════════════════
   Student Dashboard
   ═══════════════════════════════════════════════════════════════ */
function StudentDashboard({ user }) {
  const [data, setData] = useState({ applications: [], recommendations: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api.applications().catch(() => ({ data: [] })),
      api.recommendations("me").catch(() => ({ data: [] }))
    ])
      .then(([appsRes, recsRes]) => {
        setData({
          applications: appsRes.data || [],
          recommendations: recsRes.data || []
        });
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load dashboard data.");
        setLoading(false);
      });
  }, []);

  if (loading) return <DashboardSkeleton />;
  if (error) return <div className="error-message">{error}</div>;

  const { applications, recommendations } = data;

  const totalApplications = applications.length;
  const submitted = applications.filter((a) => a.status === "submitted").length;
  const offersReceived = applications.filter((a) => a.status === "offer-received").length;
  const enrolled = applications.filter((a) => a.status === "enrolled").length;

  const topRecs = recommendations.slice(0, 3);

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <h1>Hello, {user?.fullName?.split(" ")[0] || "Student"}! 👋</h1>
        <p className="text-secondary">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>

      <div className="grid grid-4 gap-md stats-row">
        <div className="dashboard-card stat-card">
          <div className="stat-icon bg-blue-100 text-blue-600">📄</div>
          <div className="stat-content">
            <p>Total Applications</p>
            <h3>{totalApplications}</h3>
          </div>
        </div>
        <div className="dashboard-card stat-card">
          <div className="stat-icon bg-yellow-100 text-yellow-600">📤</div>
          <div className="stat-content">
            <p>Submitted</p>
            <h3>{submitted}</h3>
          </div>
        </div>
        <div className="dashboard-card stat-card">
          <div className="stat-icon bg-green-100 text-green-600">🎉</div>
          <div className="stat-content">
            <p>Offers Received</p>
            <h3>{offersReceived}</h3>
          </div>
        </div>
        <div className="dashboard-card stat-card">
          <div className="stat-icon bg-teal-100 text-teal-600">🎓</div>
          <div className="stat-content">
            <p>Enrolled</p>
            <h3>{enrolled}</h3>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header-flex">
          <h2>Recommended Programs</h2>
          <Link to="/dashboard/recommendations" className="text-link">View all</Link>
        </div>
        <div className="grid grid-3 gap-md recs-row">
          {topRecs.length > 0 ? topRecs.map((rec) => (
            <div key={rec._id} className="dashboard-card rec-card">
              <div className="rec-card-header">
                <div>
                  <h4 className="uni-name">{rec.university?.name}</h4>
                  <p className="uni-location">
                    {rec.university?.country === "UK" ? "🇬🇧" : rec.university?.country === "Canada" ? "🇨🇦" : rec.university?.country === "Australia" ? "🇦🇺" : "🌍"} {rec.university?.country}
                  </p>
                </div>
                <span className="match-score">{(rec.score * 100).toFixed(0)}% Match</span>
              </div>
              <div className="rec-card-body">
                <h3 className="prog-title">{rec.program?.title}</h3>
                <p className="prog-fee">${rec.program?.tuitionFeeUsd?.toLocaleString()} / yr</p>
              </div>
              <div className="rec-card-footer">
                <Link to={`/dashboard/programs?search=${rec.program?.title}`} className="btn-outline-sm w-full text-center">View Program</Link>
              </div>
            </div>
          )) : (
            <div className="empty-state-small">
              <p>Complete your profile to get personalized recommendations.</p>
              <Link to="/dashboard/profile" className="btn-primary-sm mt-md">Complete Profile</Link>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header-flex">
          <h2>Recent Applications</h2>
          <Link to="/dashboard/applications" className="text-link">View all</Link>
        </div>
        <div className="dashboard-card p-0">
          {applications.length > 0 ? (
            <div className="table-responsive">
              <table className="clean-table">
                <thead>
                  <tr>
                    <th>Program</th>
                    <th>University</th>
                    <th>Country</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.slice(0, 5).map((app) => (
                    <tr key={app._id}>
                      <td className="font-medium">{app.program?.title}</td>
                      <td>{app.university?.name}</td>
                      <td>{app.destinationCountry}</td>
                      <td><StatusBadge status={app.status} /></td>
                      <td className="text-secondary">{new Date(app.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state-small">
              <p>You haven't started any applications yet.</p>
              <Link to="/dashboard/programs" className="btn-primary-sm mt-md">Browse Programs</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Admin Dashboard
   ═══════════════════════════════════════════════════════════════ */
function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.dashboard()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="error-message">{error}</div>;
  if (!data) return <DashboardSkeleton />;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Platform Overview</h1>
      </div>
      
      <div className="grid grid-4 gap-md stats-row">
        <div className="dashboard-card stat-card">
          <div className="stat-icon bg-blue-100 text-blue-600">👨‍🎓</div>
          <div className="stat-content">
            <p>Total Students</p>
            <h3>{data.totalStudents?.toLocaleString()}</h3>
          </div>
        </div>
        <div className="dashboard-card stat-card">
          <div className="stat-icon bg-teal-100 text-teal-600">🏛️</div>
          <div className="stat-content">
            <p>Total Programs</p>
            <h3>{data.totalPrograms?.toLocaleString()}</h3>
          </div>
        </div>
        <div className="dashboard-card stat-card">
          <div className="stat-icon bg-orange-100 text-orange-600">📄</div>
          <div className="stat-content">
            <p>Total Applications</p>
            <h3>{data.totalApplications?.toLocaleString()}</h3>
          </div>
        </div>
        <div className="dashboard-card stat-card">
          <div className="stat-icon bg-green-100 text-green-600">✅</div>
          <div className="stat-content">
            <p>Enrolled Students</p>
            <h3>{data.statusBreakdown.find(s => s._id === 'enrolled')?.count || 0}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-2 gap-md mt-xl">
        <div className="dashboard-card">
          <h3 className="card-title">Top Destination Countries</h3>
          <div className="flex flex-col gap-sm mt-md">
            {data.topCountries.map((item) => (
              <div key={item._id} className="progress-bar-row">
                <div className="progress-label">
                  <span>{item._id}</span>
                  <span>{item.count}</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill bg-blue-500" style={{ width: `${(item.count / data.totalApplications) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="dashboard-card">
          <h3 className="card-title">Application Statuses</h3>
          <div className="flex flex-col gap-sm mt-md">
            {data.statusBreakdown.map((item) => (
              <div key={item._id} className="flex justify-between items-center py-2 border-b">
                <StatusBadge status={item._id} />
                <span className="font-bold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Main Component Router
   ═══════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const user = getUser();
  
  if (!user) return null;
  
  if (user.role === 'admin' || user.role === 'counselor') {
    return <AdminDashboard />;
  }
  
  return <StudentDashboard user={user} />;
}
