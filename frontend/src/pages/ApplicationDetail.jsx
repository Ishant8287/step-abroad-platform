import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Building2, MapPin, Calendar, CheckCircle2, 
  Clock, XCircle, FileText, UploadCloud, Trash2, FileIcon 
} from 'lucide-react';
import { formatStatus, formatDate, getStatusColor } from '../utils/formatters';

const ApplicationDetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  // Mock application data for UI demonstration since backend may lack complete detailed timeline with notes
  const app = {
    _id: id,
    program: {
      name: "Master of Applied Computing",
      university: { name: "University of Toronto" },
      country: "Canada",
      degreeLevel: "Master",
    },
    intake: "September 2026",
    status: "under-review",
    createdAt: "2026-03-15T10:00:00Z",
    timeline: [
      {
        _id: 't1',
        status: "submitted",
        date: "2026-03-15T10:00:00Z",
        comments: "Application submitted successfully by the student."
      },
      {
        _id: 't2',
        status: "under-review",
        date: "2026-03-20T14:30:00Z",
        comments: "Documents verified. Sent to university admissions committee."
      }
    ],
    documents: [
      { id: 'd1', name: 'Passport.pdf', size: '2.4 MB', date: 'Mar 15, 2026' },
      { id: 'd2', name: 'Bachelor_Transcript.pdf', size: '5.1 MB', date: 'Mar 15, 2026' },
      { id: 'd3', name: 'IELTS_Score.pdf', size: '1.1 MB', date: 'Mar 15, 2026' }
    ]
  };

  useEffect(() => {
    // Simulate fetch delay
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [id]);

  const allStatuses = ['draft', 'submitted', 'under-review', 'offer-received', 'visa-processing', 'enrolled'];
  
  // Find current status index to determine which steps are completed/active/pending
  const currentStatusIndex = allStatuses.indexOf(app.status);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-6">
        <Link to="/dashboard/applications" className="inline-flex items-center text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Applications
        </Link>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Application Details</h1>
      </div>

      {/* Top Header Card */}
      <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm p-6 lg:p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-extrabold text-[var(--foreground)] mb-2">{app.program.name}</h2>
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-[var(--muted-foreground)]">
            <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4" /> {app.program.university.name}</span>
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {app.program.country}</span>
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Intake: {app.intake}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-start md:items-end">
          <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-2">Current Status</span>
          <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold border ${getStatusColor(app.status)} shadow-sm`}>
            {formatStatus(app.status)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Timeline Stepper */}
        <div className="lg:col-span-2">
          <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm p-6 lg:p-8">
            <h3 className="text-lg font-bold text-[var(--foreground)] mb-8 flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" /> Application Timeline
            </h3>

            <div className="flow-root">
              <ul className="-mb-8">
                {allStatuses.map((status, index) => {
                  const isCompleted = index < currentStatusIndex || (index === currentStatusIndex && status === 'enrolled');
                  const isActive = index === currentStatusIndex;
                  const isPending = index > currentStatusIndex;
                  
                  // Find timeline event if it exists
                  const timelineEvent = app.timeline.find(t => t.status === status);

                  // Colors
                  let circleColor = "bg-[var(--muted)] border-2 border-[var(--border)]";
                  let iconColor = "text-[var(--muted-foreground)]";
                  
                  if (isCompleted) {
                    circleColor = "bg-emerald-500 border-2 border-emerald-500";
                    iconColor = "text-white";
                  } else if (isActive) {
                    circleColor = "bg-[var(--background)] border-2 border-blue-600 dark:bg-blue-900/30";
                    iconColor = "text-blue-600 dark:text-blue-400";
                  } else if (app.status === 'rejected' && status === 'rejected') {
                    circleColor = "bg-red-500 border-2 border-red-500";
                    iconColor = "text-white";
                  }

                  // If app is rejected, hide steps after the current one, show rejected step instead
                  if (app.status === 'rejected' && isPending && status !== 'rejected') return null;
                  if (app.status !== 'rejected' && status === 'rejected') return null;

                  return (
                    <li key={status}>
                      <div className="relative pb-8">
                        {index !== allStatuses.length - 1 && status !== 'rejected' ? (
                          <span
                            className={`absolute top-4 left-4 -ml-px h-full w-0.5 ${
                              isCompleted ? 'bg-emerald-500' : 'bg-[var(--border)]'
                            }`}
                            aria-hidden="true"
                          />
                        ) : null}
                        
                        <div className="relative flex items-start space-x-4">
                          <div>
                            <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-[var(--card)] ${circleColor}`}>
                              {isCompleted ? (
                                <CheckCircle2 className={`h-5 w-5 ${iconColor}`} />
                              ) : app.status === 'rejected' && status === 'rejected' ? (
                                <XCircle className={`h-5 w-5 ${iconColor}`} />
                              ) : isActive ? (
                                <div className="h-2.5 w-2.5 rounded-full bg-blue-600 dark:bg-blue-400"></div>
                              ) : (
                                <div className="h-2.5 w-2.5 rounded-full bg-[var(--muted-foreground)] opacity-50"></div>
                              )}
                            </span>
                          </div>
                          
                          <div className="min-w-0 flex-1 py-1.5">
                            <div className="flex justify-between items-center mb-1">
                              <p className={`text-sm font-bold ${
                                isCompleted ? 'text-[var(--foreground)]' : isActive ? 'text-blue-700 dark:text-blue-400' : 'text-[var(--muted-foreground)]'
                              }`}>
                                {formatStatus(status)}
                              </p>
                              {timelineEvent && (
                                <span className="text-xs font-medium text-[var(--muted-foreground)]">
                                  {formatDate(timelineEvent.date)}
                                </span>
                              )}
                            </div>
                            
                            {timelineEvent?.comments && (
                              <p className="text-sm text-[var(--muted-foreground)] italic mt-2 bg-[var(--muted)]/50 p-3 rounded-lg border border-[var(--border)]">
                                "{timelineEvent.comments}"
                              </p>
                            )}
                            
                            {isActive && !timelineEvent?.comments && (
                              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                                Currently in progress...
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column - Documents & Summary */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Documents Section */}
          <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--muted)]">
              <h3 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">Required Documents</h3>
            </div>
            
            <div className="p-6">
              {/* Upload Area */}
              <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-6 text-center hover:bg-[var(--muted)] transition-colors cursor-pointer mb-6 group">
                <div className="bg-blue-50 dark:bg-blue-900/20 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <UploadCloud className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-sm font-medium text-[var(--foreground)] mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-[var(--muted-foreground)] mb-4">PDF, JPG, PNG (max. 10MB)</p>
                <button className="px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-sm font-medium text-[var(--foreground)] shadow-sm hover:border-blue-300">
                  Select File
                </button>
              </div>

              {/* Uploaded Files */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider">Uploaded Files</h4>
                {app.documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border border-[var(--border)] rounded-lg bg-[var(--background)] group">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded flex-shrink-0">
                        <FileIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[var(--foreground)] truncate">{doc.name}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">{doc.size} • {doc.date}</p>
                      </div>
                    </div>
                    <button className="p-2 text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;
