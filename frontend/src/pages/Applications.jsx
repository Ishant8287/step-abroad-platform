import { useState, useEffect } from 'react';
import { getApplications } from '../api/applications';
import StatusBadge from '../components/StatusBadge';
import { formatDate, getStatusColor } from '../utils/formatters';
import { FileText, Building2, ChevronRight, Plus, MapPin, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const navigate = useNavigate();

  const tabs = ['All', 'Draft', 'Submitted', 'Under Review', 'Offer Received', 'Enrolled', 'Rejected'];

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const data = await getApplications();
        setApplications(data.data || []);
      } catch (error) {
        console.error('Failed to fetch applications', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const filteredApps = activeTab === 'All' 
    ? applications 
    : applications.filter(app => app.status === activeTab.toLowerCase().replace(' ', '-'));

  const getIndicatorColor = (status) => {
    const map = {
      'draft': 'bg-slate-400',
      'submitted': 'bg-blue-500',
      'under-review': 'bg-purple-500',
      'offer-received': 'bg-emerald-500',
      'visa-processing': 'bg-amber-500',
      'enrolled': 'bg-indigo-500',
      'rejected': 'bg-red-500'
    };
    return map[status] || 'bg-slate-300';
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">My Applications</h1>
          <p className="text-[var(--muted-foreground)] mt-1">Track the status of your university applications.</p>
        </div>
        <Link 
          to="/dashboard/programs" 
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Application
        </Link>
      </div>

      <div className="mb-6 overflow-x-auto pb-2 flex-shrink-0">
        <div className="flex space-x-2 border-b border-[var(--border)]">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--border)]'
              }`}
            >
              {tab}
              {tab === 'All' && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--muted)] text-[var(--foreground)]">
                  {applications.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredApps.length > 0 ? (
          <div className="space-y-4">
            {filteredApps.map((app) => (
              <div 
                key={app._id} 
                className="bg-[var(--card)] rounded-xl border border-[var(--border)] shadow-sm overflow-hidden hover:shadow-md transition-all flex relative group"
              >
                {/* Status Indicator Bar */}
                <div className={`w-1.5 flex-shrink-0 ${getIndicatorColor(app.status)}`}></div>
                
                <div className="flex-1 p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-[var(--foreground)] truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {app.program?.name || 'Program Name'}
                      </h3>
                      <StatusBadge status={app.status} />
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-sm font-medium text-[var(--foreground)] mb-3">
                      <Building2 className="h-4 w-4 text-[var(--muted-foreground)]" />
                      <span className="truncate">{app.program?.university?.name || 'University Name'}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--muted-foreground)]">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        <span>{app.program?.country || 'Country'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>Intake: {app.intake}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FileText className="h-4 w-4" />
                        <span>Applied: {formatDate(app.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 sm:pl-4 sm:border-l border-[var(--border)] flex items-center">
                    <button 
                      onClick={() => navigate(`/dashboard/applications/${app._id}`)}
                      className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      View Details
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-[var(--card)] rounded-xl border border-[var(--border)] border-dashed">
            <div className="mx-auto h-24 w-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-[var(--foreground)]">No applications found</h3>
            <p className="mt-1 text-sm text-[var(--muted-foreground)] max-w-sm mx-auto">
              {activeTab === 'All' 
                ? "You haven't submitted any applications yet. Browse programs and start your journey!" 
                : `You don't have any applications in the "${activeTab}" status.`}
            </p>
            {activeTab === 'All' && (
              <Link to="/dashboard/programs" className="mt-6 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors">
                Browse Programs
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
