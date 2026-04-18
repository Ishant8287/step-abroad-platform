import { useState, useEffect } from 'react';
import { getPrograms } from '../api/programs';
import { getMyRecommendations } from '../api/recommendations';
import { createApplication } from '../api/applications';
import ProgramCard from '../components/ProgramCard';
import { Search, Sparkles, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Programs = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('all');
  
  const [filters, setFilters] = useState({
    search: '',
    countries: [],
    degreeLevel: '',
    scholarship: false,
    maxTuition: 50000
  });

  const [sortBy, setSortBy] = useState('recommended');

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      try {
        if (viewMode === 'recommended') {
          const data = await getMyRecommendations();
          setPrograms(data.data || []);
        } else {
          // Flatten countries array for API if needed, or pass as is
          const data = await getPrograms({ ...filters, sort: sortBy });
          // In a real app with pagination: setPrograms(data.data.items);
          setPrograms(data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch programs', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => fetchPrograms(), 400);
    return () => clearTimeout(timer);
  }, [viewMode, filters, sortBy]);

  const handleCountryToggle = (country) => {
    setFilters(prev => ({
      ...prev,
      countries: prev.countries.includes(country) 
        ? prev.countries.filter(c => c !== country)
        : [...prev.countries, country]
    }));
  };

  const handleApply = async (programId, intake) => {
    try {
      const result = await createApplication({ programId, intake });
      navigate(`/dashboard/applications/${result.data._id}`);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit application');
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-6 flex justify-between items-end flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Programs</h1>
          <p className="text-[var(--muted-foreground)] mt-1">Find the perfect degree for your career goals.</p>
        </div>
        <div className="flex bg-[var(--muted)] p-1 rounded-lg border border-[var(--border)]">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'all' ? 'bg-[var(--card)] shadow-sm text-[var(--foreground)]' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
            onClick={() => setViewMode('all')}
          >
            All Programs
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
              viewMode === 'recommended' ? 'bg-[var(--card)] shadow-sm text-blue-600 dark:text-blue-400' : 'text-[var(--muted-foreground)] hover:text-blue-600'
            }`}
            onClick={() => setViewMode('recommended')}
          >
            <Sparkles className="h-4 w-4" />
            Recommended
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Left Sidebar Filters */}
        <div className="w-64 flex-shrink-0 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-[var(--border)] flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-[var(--muted-foreground)]" />
            <h2 className="font-semibold text-[var(--foreground)]">Filters</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Search */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-[var(--muted-foreground)]" />
                </div>
                <input
                  type="text"
                  placeholder="Search programs..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="block w-full pl-9 py-2 bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Countries */}
            <div>
              <h3 className="text-sm font-bold text-[var(--foreground)] mb-3">Country</h3>
              <div className="space-y-2">
                {['USA', 'UK', 'Canada', 'Australia', 'UAE'].map(country => (
                  <label key={country} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.countries.includes(country)}
                      onChange={() => handleCountryToggle(country)}
                      className="rounded border-[var(--border)] text-blue-600 focus:ring-blue-500 bg-[var(--background)]"
                    />
                    <span className="ml-2 text-sm text-[var(--foreground)]">{country}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Degree Level */}
            <div>
              <h3 className="text-sm font-bold text-[var(--foreground)] mb-3">Degree Level</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="degree"
                    checked={filters.degreeLevel === ''}
                    onChange={() => setFilters({ ...filters, degreeLevel: '' })}
                    className="border-[var(--border)] text-blue-600 focus:ring-blue-500 bg-[var(--background)]"
                  />
                  <span className="ml-2 text-sm text-[var(--foreground)]">Any Level</span>
                </label>
                {['Bachelor', 'Master', 'PhD'].map(level => (
                  <label key={level} className="flex items-center">
                    <input
                      type="radio"
                      name="degree"
                      checked={filters.degreeLevel === level}
                      onChange={() => setFilters({ ...filters, degreeLevel: level })}
                      className="border-[var(--border)] text-blue-600 focus:ring-blue-500 bg-[var(--background)]"
                    />
                    <span className="ml-2 text-sm text-[var(--foreground)]">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Scholarship Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[var(--foreground)]">Scholarships Only</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={filters.scholarship}
                  onChange={(e) => setFilters({ ...filters, scholarship: e.target.checked })}
                />
                <div className="w-9 h-5 bg-[var(--muted)] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Tuition Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold text-[var(--foreground)]">Max Tuition</h3>
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">${filters.maxTuition / 1000}k</span>
              </div>
              <input
                type="range"
                min="10000"
                max="100000"
                step="5000"
                value={filters.maxTuition}
                onChange={(e) => setFilters({ ...filters, maxTuition: Number(e.target.value) })}
                className="w-full h-2 bg-[var(--muted)] rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>
          
          <div className="p-4 border-t border-[var(--border)] bg-[var(--muted)]">
            <button 
              onClick={() => setFilters({ search: '', countries: [], degreeLevel: '', scholarship: false, maxTuition: 50000 })}
              className="w-full py-2 text-sm font-medium text-[var(--muted-foreground)] bg-[var(--card)] border border-[var(--border)] rounded-lg hover:bg-[var(--muted)] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-sm p-4 mb-6 flex justify-between items-center flex-shrink-0">
            <p className="text-sm font-medium text-[var(--muted-foreground)]">
              Showing <span className="font-bold text-[var(--foreground)]">{programs.length}</span> programs
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--muted-foreground)]">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
              >
                <option value="recommended">Recommended</option>
                <option value="tuition_asc">Tuition (Low to High)</option>
                <option value="tuition_desc">Tuition (High to Low)</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto pr-2 pb-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : programs.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {programs.map((program) => (
                  <ProgramCard key={program._id} program={program} onApply={handleApply} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-[var(--card)] rounded-xl border border-[var(--border)] border-dashed">
                <Search className="mx-auto h-12 w-12 text-[var(--muted-foreground)] opacity-50" />
                <h3 className="mt-2 text-sm font-bold text-[var(--foreground)]">No programs found</h3>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">Try adjusting your filters to find what you're looking for.</p>
              </div>
            )}
            
            {/* Pagination Placeholder */}
            {programs.length > 0 && (
              <div className="mt-8 flex justify-center items-center gap-2 pb-4">
                <button className="p-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] disabled:opacity-50">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button className="w-10 h-10 rounded-lg border border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-medium">1</button>
                <button className="w-10 h-10 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--muted)] font-medium">2</button>
                <button className="w-10 h-10 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--muted)] font-medium">3</button>
                <span className="text-[var(--muted-foreground)]">...</span>
                <button className="p-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Programs;
