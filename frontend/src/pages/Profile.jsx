import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { User, Mail, GraduationCap, MapPin, DollarSign, BookA, CheckCircle2 } from 'lucide-react';

const Profile = () => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    countries: ['Canada', 'UK'],
    fields: ['Computer Science', 'Business'],
    intake: 'September 2026',
    budget: 35000,
    ielts: 7.5,
    avatar: null
  });

  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
    }, 800);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">My Profile</h1>
          <p className="text-[var(--muted-foreground)] mt-1">Manage your personal information and study preferences.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-[var(--muted-foreground)]">Profile Completion: 75%</span>
          <div className="w-48 h-2.5 bg-[var(--muted)] rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <form onSubmit={handleSave}>
            {/* Personal Information */}
            <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] shadow-sm overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--muted)]">
                <h2 className="text-lg font-semibold text-[var(--foreground)] flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Personal Information
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-[var(--muted-foreground)]" />
                      </div>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="block w-full pl-10 py-2.5 bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-[var(--muted-foreground)]" />
                      </div>
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="block w-full pl-10 py-2.5 bg-[var(--muted)] border border-[var(--border)] text-[var(--muted-foreground)] rounded-lg text-sm cursor-not-allowed"
                      />
                    </div>
                    <p className="mt-1 text-xs text-[var(--muted-foreground)]">Email cannot be changed.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Study Preferences */}
            <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] shadow-sm overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--muted)]">
                <h2 className="text-lg font-semibold text-[var(--foreground)] flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  Study Preferences
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Target Countries</label>
                  <div className="flex flex-wrap gap-2">
                    {['USA', 'UK', 'Canada', 'Australia', 'UAE'].map(country => (
                      <button
                        key={country}
                        type="button"
                        onClick={() => {
                          const newCountries = formData.countries.includes(country)
                            ? formData.countries.filter(c => c !== country)
                            : [...formData.countries, country];
                          setFormData({ ...formData, countries: newCountries });
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                          formData.countries.includes(country)
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-300'
                            : 'bg-[var(--background)] border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]'
                        }`}
                      >
                        {formData.countries.includes(country) && <CheckCircle2 className="h-4 w-4" />}
                        {country}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Interested Fields</label>
                    <input
                      type="text"
                      placeholder="e.g. Computer Science, Business (comma separated)"
                      value={formData.fields.join(', ')}
                      onChange={(e) => setFormData({ ...formData, fields: e.target.value.split(',').map(s => s.trim()) })}
                      className="block w-full px-4 py-2.5 bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Preferred Intake</label>
                    <select
                      value={formData.intake}
                      onChange={(e) => setFormData({ ...formData, intake: e.target.value })}
                      className="block w-full px-4 py-2.5 bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    >
                      <option>September 2026</option>
                      <option>January 2027</option>
                      <option>May 2027</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial & Language */}
            <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] shadow-sm overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--muted)]">
                <h2 className="text-lg font-semibold text-[var(--foreground)] flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  Financial & Language
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-[var(--foreground)]">Maximum Annual Tuition Budget</label>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">${formData.budget.toLocaleString()} USD</span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="100000"
                    step="1000"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                    className="w-full h-2 bg-[var(--muted)] rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-xs text-[var(--muted-foreground)] mt-2">
                    <span>$10,000</span>
                    <span>$100,000+</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Overall IELTS Score</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      min="0"
                      max="9"
                      step="0.5"
                      value={formData.ielts}
                      onChange={(e) => setFormData({ ...formData, ielts: Number(e.target.value) })}
                      className="block w-32 px-4 py-2.5 bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                    />
                    <span className="text-sm text-[var(--muted-foreground)]">Used for matching program requirements.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 flex items-center gap-2"
              >
                {saving && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Sidebar - Profile Preview */}
        <div className="xl:col-span-1">
          <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] shadow-sm p-6 sticky top-24">
            <h3 className="text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-6">Profile Preview</h3>
            
            <div className="flex flex-col items-center text-center mb-6">
              <div className="relative group cursor-pointer">
                <div className="h-24 w-24 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-3xl font-bold mb-4 shadow-sm border border-blue-200 dark:border-blue-800 overflow-hidden">
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    formData.name.charAt(0) || 'U'
                  )}
                </div>
                
                <label className="absolute inset-0 mb-4 bg-black/50 text-white flex flex-col items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <span className="text-xs font-medium">Upload</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>
              <h2 className="text-xl font-bold text-[var(--foreground)]">{formData.name}</h2>
              <p className="text-sm text-[var(--muted-foreground)]">{formData.email}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-[var(--muted-foreground)] mb-0.5">Target Countries</p>
                  <p className="text-sm font-medium text-[var(--foreground)]">{formData.countries.join(', ') || 'None selected'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BookA className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-[var(--muted-foreground)] mb-0.5">Interested Fields</p>
                  <p className="text-sm font-medium text-[var(--foreground)]">{formData.fields.join(', ') || 'None selected'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-[var(--muted-foreground)] mb-0.5">Budget</p>
                  <p className="text-sm font-medium text-[var(--foreground)]">${formData.budget.toLocaleString()} / year</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
