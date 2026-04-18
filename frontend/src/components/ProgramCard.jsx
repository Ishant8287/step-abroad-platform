import { MapPin, DollarSign, Calendar, Building2, Sparkles } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';

const ProgramCard = ({ program, onApply }) => {
  const navigate = useNavigate();
  
  const getCountryFlag = (country) => {
    const flags = { 'USA': '🇺🇸', 'UK': '🇬🇧', 'Canada': '🇨🇦', 'Australia': '🇦🇺', 'UAE': '🇦🇪' };
    return flags[country] || '🌍';
  };

  return (
    <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col group">
      <div className="p-6 flex-1">
        <div className="flex items-start gap-4 mb-4">
          <div className="h-12 w-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-[var(--border)] flex-shrink-0">
            <Building2 className="h-6 w-6 text-slate-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-[var(--foreground)] mb-1 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {program.name}
            </h3>
            <p className="text-sm font-medium text-[var(--muted-foreground)]">
              {program.university?.name || 'University'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
          <div className="flex items-center text-sm text-[var(--muted-foreground)] gap-1">
            <span>{getCountryFlag(program.country)}</span>
            <span>{program.country}</span>
          </div>
          <div className="flex items-center text-sm text-[var(--muted-foreground)] gap-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-[var(--border)]">
              {program.degreeLevel}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--muted-foreground)]">Tuition / Year</span>
            <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">
              {formatCurrency(program.tuitionFeeUsd)}
            </span>
          </div>
          
          <div>
            <span className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider block mb-2">Intakes</span>
            <div className="flex flex-wrap gap-2">
              {program.intakes.map(intake => (
                <span key={intake} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)]">
                  <Calendar className="h-3 w-3 mr-1 text-[var(--muted-foreground)]" />
                  {intake}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {program.scholarshipAvailable && (
          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
              <Sparkles className="h-3 w-3 mr-1" />
              Scholarships Available
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-[var(--border)] bg-[var(--muted)]/50 grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate(`/dashboard/programs/${program._id}`)}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-[var(--border)] text-sm font-medium rounded-lg text-[var(--foreground)] bg-[var(--card)] hover:bg-[var(--muted)] transition-colors"
        >
          View Details
        </button>
        <button
          onClick={() => onApply && onApply(program._id, program.intakes?.[0] || 'September 2026')}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default ProgramCard;
