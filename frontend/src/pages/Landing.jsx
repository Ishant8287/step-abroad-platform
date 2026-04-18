import { Link } from 'react-router-dom';
import { GraduationCap, Search, Globe2, BookOpen, ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">StepAbroad</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors">
                Log in
              </Link>
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 tracking-tight mb-8">
            Your journey to a global <span className="text-blue-600">education</span> starts here.
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover top universities, get personalized program recommendations, and manage your applications all in one powerful platform.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to="/register" className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl text-base font-medium shadow-sm transition-all hover:shadow-md">
              Start Your Application <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/login" className="w-full sm:w-auto inline-flex justify-center items-center bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-8 py-3.5 rounded-xl text-base font-medium shadow-sm transition-all">
              Sign In to Dashboard
            </Link>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid sm:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-left">
            <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Smart Discovery</h3>
            <p className="text-slate-600 text-sm">Find the perfect university and program tailored to your background and budget.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-left">
            <div className="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">AI Recommendations</h3>
            <p className="text-slate-600 text-sm">Our aggregation engine scores programs based on your profile to give you the highest match rate.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-left">
            <div className="bg-emerald-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Globe2 className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Track Applications</h3>
            <p className="text-slate-600 text-sm">Manage your entire application lifecycle from draft to enrolled with a visual timeline.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center">
        <p className="text-sm text-slate-500">© 2026 StepAbroad Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
