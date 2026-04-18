import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Heart, Share2, Award, GraduationCap, MapPin, Calendar, Clock, DollarSign, Sparkles, FileCheck2, Building2 } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { createApplication } from '../api/applications';
import api from '../api/axios'; // Import the axios instance to fetch real program details

const ProgramDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedIntake, setSelectedIntake] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [program, setProgram] = useState(null);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const response = await api.get(`/programs/${id}`);
        setProgram(response.data.data);
        if (response.data.data?.intakes?.length > 0) {
          setSelectedIntake(response.data.data.intakes[0]);
        }
      } catch (error) {
        console.error('Failed to fetch program details', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProgram();
  }, [id]);

  const handleApply = async () => {
    if (!selectedIntake) return alert('Please select an intake');
    setIsApplying(true);
    try {
      const result = await createApplication({ programId: program._id, intake: selectedIntake });
      navigate(`/dashboard/applications/${result.data._id}`);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to apply');
    } finally {
      setIsApplying(false);
    }
  };

  if (loading || !program) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Breadcrumb */}
      <nav className="flex text-sm text-[var(--muted-foreground)] mb-6">
        <ol className="flex items-center space-x-2">
          <li><Link to="/dashboard/programs" className="hover:text-[var(--foreground)] transition-colors">Programs</Link></li>
          <li><ChevronRight className="h-4 w-4" /></li>
          <li><span className="hover:text-[var(--foreground)] transition-colors cursor-pointer">{program.field}</span></li>
          <li><ChevronRight className="h-4 w-4" /></li>
          <li className="font-medium text-[var(--foreground)]">{program.name}</li>
        </ol>
      </nav>

      {/* Hero Section */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden mb-8 relative">
        <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700 w-full relative">
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 -mt-12">
            <div className="flex items-end gap-6">
              <div className="h-24 w-24 rounded-2xl bg-white p-2 shadow-lg border border-[var(--border)] flex-shrink-0 z-10 flex items-center justify-center">
                <Building2 className="h-12 w-12 text-blue-600" />
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-lg font-bold text-[var(--foreground)]">{program.university.name}</h2>
                  {program.university.partner && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      <Award className="h-3 w-3 mr-1" /> Verified Partner
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-extrabold text-[var(--foreground)] tracking-tight">{program.name}</h1>
                <div className="flex items-center gap-4 mt-3 text-sm text-[var(--muted-foreground)]">
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {program.city}, {program.country}</span>
                  <span className="flex items-center gap-1"><GraduationCap className="h-4 w-4" /> {program.degreeLevel}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)] hover:text-red-500 hover:border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shadow-sm">
                <Heart className="h-5 w-5" />
              </button>
              <button className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)] hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all shadow-sm">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Overview Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[var(--card)] p-4 rounded-xl border border-[var(--border)] shadow-sm">
              <p className="text-xs text-[var(--muted-foreground)] font-medium uppercase tracking-wider mb-1">Duration</p>
              <p className="font-bold text-[var(--foreground)] flex items-center gap-2"><Clock className="h-4 w-4 text-blue-500" /> {program.duration}</p>
            </div>
            <div className="bg-[var(--card)] p-4 rounded-xl border border-[var(--border)] shadow-sm">
              <p className="text-xs text-[var(--muted-foreground)] font-medium uppercase tracking-wider mb-1">Field</p>
              <p className="font-bold text-[var(--foreground)] flex items-center gap-2"><BookA className="h-4 w-4 text-indigo-500" /> {program.field}</p>
            </div>
            <div className="bg-[var(--card)] p-4 rounded-xl border border-[var(--border)] shadow-sm md:col-span-2">
              <p className="text-xs text-[var(--muted-foreground)] font-medium uppercase tracking-wider mb-1">Tuition Fee</p>
              <p className="font-bold text-[var(--foreground)] flex items-end gap-2">
                <span className="text-xl text-emerald-600 dark:text-emerald-400">{formatCurrency(program.tuitionFeeUsd)}</span>
                <span className="text-sm text-[var(--muted-foreground)] font-normal mb-0.5">/ year</span>
              </p>
            </div>
          </div>

          {/* Intakes & Deadlines */}
          <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] shadow-sm p-6">
            <h3 className="text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" /> Available Intakes
            </h3>
            <div className="flex flex-wrap gap-3">
              {program.intakes.map(intake => (
                <div key={intake} className="px-4 py-3 rounded-lg border border-blue-100 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 flex items-center gap-3">
                  <div className="bg-white dark:bg-[var(--card)] p-1.5 rounded shadow-sm">
                    <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="font-medium text-blue-900 dark:text-blue-100">{intake}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] shadow-sm p-6">
            <h3 className="text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <FileCheck2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" /> Admission Requirements
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-[var(--foreground)] mb-2">Academic Requirements</h4>
                <p className="text-[var(--muted-foreground)] leading-relaxed text-sm bg-[var(--muted)] p-4 rounded-lg border border-[var(--border)]">
                  {program.academicRequirement}
                </p>
              </div>
              
              <div className="flex items-center gap-4 bg-[var(--background)] p-4 rounded-lg border border-[var(--border)]">
                <div className="h-12 w-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center border border-indigo-100 dark:border-indigo-800 flex-shrink-0">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">{program.minIelts}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--foreground)]">Minimum IELTS Score</h4>
                  <p className="text-sm text-[var(--muted-foreground)]">Overall band score required. Equivalent TOEFL/PTE accepted.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Sticky Apply Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-md p-6">
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-6">Ready to apply?</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Select your intake</label>
                <div className="space-y-2">
                  {program.intakes.map(intake => (
                    <label key={intake} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedIntake === intake 
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-[var(--border)] hover:bg-[var(--muted)]'
                    }`}>
                      <div className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name="intake_selection" 
                          checked={selectedIntake === intake}
                          onChange={() => setSelectedIntake(intake)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className={`font-medium ${selectedIntake === intake ? 'text-blue-900 dark:text-blue-100' : 'text-[var(--foreground)]'}`}>
                          {intake}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleApply} 
                disabled={isApplying}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-sm transition-all hover:shadow-md mb-4 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isApplying ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Applying...
                  </>
                ) : (
                  <>
                    Start Application <ChevronRight className="h-5 w-5" />
                  </>
                )}
              </button>
              
              <p className="text-xs text-center text-[var(--muted-foreground)]">
                Applying is free. No credit card required.
              </p>
            </div>

            {program.scholarshipAvailable && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-900/50 p-5 flex items-start gap-3">
                <div className="bg-green-100 dark:bg-green-800 p-2 rounded-lg text-green-700 dark:text-green-300 flex-shrink-0">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-green-800 dark:text-green-300 mb-1">Scholarships Available</h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    International students are eligible for merit-based awards up to $10,000.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// BookA icon was not imported from lucide-react in the file, fixing that by replacing it with BookOpen or adding it
import { BookA } from 'lucide-react';

export default ProgramDetail;
