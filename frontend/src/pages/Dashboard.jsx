import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { getDashboardOverview } from '../api/dashboard';
import { getMyRecommendations } from '../api/recommendations';
import { getApplications } from '../api/applications';
import { FileText, Send, CheckCircle2, GraduationCap, ChevronRight, Building2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency, formatDate } from '../utils/formatters';

const Dashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [recentApps, setRecentApps] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewData, recsData, appsData] = await Promise.all([
          getDashboardOverview().catch(() => null),
          getMyRecommendations().catch(() => ({ data: [] })),
          getApplications().catch(() => ({ data: [] }))
        ]);
        
        if (overviewData) setOverview(overviewData);
        setRecommendations(recsData.data?.slice(0, 3) || []);
        setRecentApps(appsData.data?.slice(0, 5) || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const currentDate = new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date());

  const getStatCount = (statusId) => overview?.statusBreakdown?.find(s => s._id === statusId)?.count || 0;
  
  const stats = [
    { name: 'Total Applications', value: overview?.totalApplications || recentApps.length, icon: FileText, color: 'bg-blue-500' },
    { name: 'Submitted', value: getStatCount('submitted'), icon: Send, color: 'bg-indigo-500' },
    { name: 'Offers Received', value: getStatCount('offer-received'), icon: CheckCircle2, color: 'bg-emerald-500' },
    { name: 'Enrolled', value: getStatCount('enrolled'), icon: GraduationCap, color: 'bg-purple-500' },
  ];

  const getCountryFlag = (country) => {
    const flags = { 'USA': '🇺🇸', 'UK': '🇬🇧', 'Canada': '🇨🇦', 'Australia': '🇦🇺', 'UAE': '🇦🇪' };
    return flags[country] || '🌍';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Hello, {user?.name?.split(' ')[0]}!</h1>
        <p className="text-[var(--muted-foreground)] mt-1">{currentDate}</p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6 shadow-sm flex items-center hover:shadow-md transition-shadow">
              <div className={`p-4 rounded-xl ${stat.color} bg-opacity-10 dark:bg-opacity-20 mr-4`}>
                <Icon className={`h-7 w-7 text-${stat.color.split('-')[1]}-600 dark:text-${stat.color.split('-')[1]}-400`} />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--muted-foreground)] mb-1">{stat.name}</p>
                <p className="text-3xl font-bold text-[var(--foreground)]">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recommended Programs */}
      {recommendations.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[var(--foreground)]">Recommended Programs</h2>
            <Link to="/dashboard/recommendations" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((program) => (
              <div 
                key={program._id} 
                onClick={() => navigate(`/dashboard/programs/${program._id}`)}
                className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-[var(--muted-foreground)]">
                      <span className="text-lg">{getCountryFlag(program.country)}</span>
                      <span>{program.university?.name || 'University'}</span>
                    </div>
                    {program.matchScore && (
                      <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                        {program.matchScore}% Match
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-[var(--foreground)] mb-2 line-clamp-2">{program.name}</h3>
                </div>
                <div className="mt-4 pt-4 border-t border-[var(--border)] flex justify-between items-center">
                  <span className="text-[var(--muted-foreground)] text-sm">{program.degreeLevel}</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{formatCurrency(program.tuitionFeeUsd)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Applications Table */}
      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-[var(--border)] flex justify-between items-center">
          <h2 className="text-lg font-bold text-[var(--foreground)]">Recent Applications</h2>
          <Link to="/dashboard/applications" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1">
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--muted)] text-[var(--muted-foreground)] border-b border-[var(--border)]">
              <tr>
                <th className="px-6 py-3 font-medium">Program & University</th>
                <th className="px-6 py-3 font-medium">Country</th>
                <th className="px-6 py-3 font-medium">Date Applied</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {recentApps.length > 0 ? recentApps.map((app) => (
                <tr 
                  key={app._id} 
                  onClick={() => navigate(`/dashboard/applications/${app._id}`)}
                  className="hover:bg-[var(--muted)] transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-[var(--foreground)]">{app.program?.name}</p>
                    <div className="flex items-center gap-1.5 text-[var(--muted-foreground)] mt-0.5 text-xs">
                      <Building2 className="h-3.5 w-3.5" />
                      {app.program?.university?.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[var(--muted-foreground)]">
                    <span className="flex items-center gap-1.5">
                      {getCountryFlag(app.program?.country)} {app.program?.country}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[var(--muted-foreground)]">
                    {formatDate(app.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={app.status} />
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-[var(--muted-foreground)]">
                    No recent applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
