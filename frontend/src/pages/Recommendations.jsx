import { useState, useEffect } from 'react';
import { getMyRecommendations } from '../api/recommendations';
import { Sparkles, Zap, Building2, MapPin, GraduationCap, CheckCircle2, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const data = await getMyRecommendations();
        // Fallback mock data if API fails or is empty for UI testing
        if (data.data && data.data.length > 0) {
          setRecommendations(data.data);
        } else {
          setRecommendations([
            {
              _id: '1',
              name: 'Master of Applied Computing',
              university: { name: 'University of Toronto' },
              country: 'Canada',
              degreeLevel: 'Master',
              tuitionFeeUsd: 45000,
              matchScore: 92,
              reasons: ['Preferred country match', 'Within budget', 'Intake available', 'High field relevance']
            },
            {
              _id: '2',
              name: 'MSc Computer Science',
              university: { name: 'Imperial College London' },
              country: 'UK',
              degreeLevel: 'Master',
              tuitionFeeUsd: 48000,
              matchScore: 88,
              reasons: ['Preferred country match', 'Intake available', 'Strong academic match']
            },
            {
              _id: '3',
              name: 'Master of Information Technology',
              university: { name: 'University of Melbourne' },
              country: 'Australia',
              degreeLevel: 'Master',
              tuitionFeeUsd: 42000,
              matchScore: 85,
              reasons: ['Within budget', 'Intake available', 'Field relevance']
            }
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch recommendations', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, []);

  // Simple SVG Donut Chart component for the match score
  const ScoreDonut = ({ score }) => {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    
    // Color logic based on score
    const colorClass = score >= 90 ? 'text-emerald-500' : score >= 80 ? 'text-blue-500' : 'text-amber-500';

    return (
      <div className="relative flex items-center justify-center h-20 w-20">
        <svg className="transform -rotate-90 w-20 h-20">
          <circle
            className="text-[var(--muted)]"
            strokeWidth="6"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="40"
            cy="40"
          />
          <circle
            className={`${colorClass} transition-all duration-1000 ease-out`}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="40"
            cy="40"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`text-xl font-bold ${colorClass}`}>{score}%</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Your Recommended Programs</h1>
          <p className="text-[var(--muted-foreground)] mt-1">Powered by AI based on your profile.</p>
        </div>
        <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shadow-sm">
          <Zap className="h-4 w-4 mr-1.5 text-indigo-500" />
          AI Powered
        </div>
      </div>

      {/* Profile Summary Strip */}
      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] shadow-sm p-4 mb-8 flex flex-wrap items-center gap-x-8 gap-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider">Target</span>
          <span className="text-sm font-medium text-[var(--foreground)]">Canada, UK</span>
        </div>
        <div className="w-px h-4 bg-[var(--border)] hidden sm:block"></div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider">Field</span>
          <span className="text-sm font-medium text-[var(--foreground)]">Computer Science</span>
        </div>
        <div className="w-px h-4 bg-[var(--border)] hidden sm:block"></div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider">Budget</span>
          <span className="text-sm font-medium text-[var(--foreground)]">Max $35k/yr</span>
        </div>
        <button className="ml-auto text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
          Edit Profile
        </button>
      </div>

      <div className="space-y-6">
        {recommendations.map((program, index) => (
          <div key={program._id || index} className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col md:flex-row">
            
            {/* Score Section (Left) */}
            <div className="p-6 md:w-48 bg-[var(--muted)]/30 border-b md:border-b-0 md:border-r border-[var(--border)] flex flex-col items-center justify-center flex-shrink-0">
              <ScoreDonut score={program.matchScore || Math.floor(Math.random() * 20) + 75} />
              <p className="text-sm font-medium text-[var(--foreground)] mt-3">Match Score</p>
              <div className="mt-2 text-xs text-[var(--muted-foreground)] text-center px-2">
                Based on 5 profile data points
              </div>
            </div>

            {/* Details Section (Middle) */}
            <div className="p-6 flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                  Top #{index + 1} Pick
                </span>
                <span className="text-sm font-medium text-[var(--muted-foreground)] flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {program.country}
                </span>
              </div>
              
              <h2 className="text-xl font-bold text-[var(--foreground)] mb-1 leading-tight">{program.name}</h2>
              
              <div className="flex items-center gap-2 text-sm font-medium text-[var(--muted-foreground)] mb-4">
                <Building2 className="h-4 w-4" />
                <span>{program.university?.name || 'University'}</span>
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1.5 text-[var(--foreground)]">
                  <GraduationCap className="h-4 w-4 text-slate-400" />
                  {program.degreeLevel}
                </span>
                <span className="flex items-center gap-1.5 text-[var(--foreground)] font-medium">
                  {formatCurrency(program.tuitionFeeUsd)} / year
                </span>
              </div>
            </div>

            {/* Tags & Actions (Right) */}
            <div className="p-6 md:w-64 border-t md:border-t-0 md:border-l border-[var(--border)] bg-[var(--muted)]/10 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">Why this program?</h4>
                <div className="space-y-2">
                  {(program.reasons || ['High field relevance', 'Within budget']).map((reason, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs font-medium text-[var(--foreground)] leading-snug">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 flex flex-col gap-2">
                <button 
                  onClick={() => navigate(`/dashboard/programs/${program._id}`)}
                  className="w-full inline-flex justify-center items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                >
                  Apply Now
                </button>
                <button 
                  onClick={() => navigate(`/dashboard/programs/${program._id}`)}
                  className="w-full inline-flex justify-center items-center px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)] text-sm font-medium rounded-lg transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
