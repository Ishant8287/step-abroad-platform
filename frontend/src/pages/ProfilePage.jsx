import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { getUser, setSession } from "../lib/auth";
import "./ProfilePage.css";

const ALL_COUNTRIES = ["Canada", "UK", "Australia", "USA", "UAE", "Germany", "France", "Singapore"];
const ALL_FIELDS = ["Computer Science", "Business", "Engineering", "Arts", "Medicine", "Data Science", "Design"];

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    targetCountries: [],
    interestedFields: [],
    preferredIntake: "",
    maxBudgetUsd: 20000,
    englishTest: { type: "IELTS", score: "" }
  });

  useEffect(() => {
    api.me()
      .then((res) => {
        setUser(res.data);
        setForm({
          fullName: res.data.fullName || "",
          email: res.data.email || "",
          targetCountries: res.data.targetCountries || [],
          interestedFields: res.data.interestedFields || [],
          preferredIntake: res.data.preferredIntake || "",
          maxBudgetUsd: res.data.maxBudgetUsd || 20000,
          englishTest: {
            type: res.data.englishTest?.type || "IELTS",
            score: res.data.englishTest?.score || ""
          }
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const calculateCompletion = () => {
    let completed = 0;
    let total = 6;
    if (form.fullName) completed++;
    if (form.targetCountries.length > 0) completed++;
    if (form.interestedFields.length > 0) completed++;
    if (form.preferredIntake) completed++;
    if (form.maxBudgetUsd > 0) completed++;
    if (form.englishTest.score) completed++;
    return Math.round((completed / total) * 100);
  };

  const toggleArrayItem = (field, item) => {
    setForm(prev => {
      const arr = prev[field];
      if (arr.includes(item)) {
        return { ...prev, [field]: arr.filter(i => i !== item) };
      } else {
        return { ...prev, [field]: [...arr, item] };
      }
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        fullName: form.fullName,
        targetCountries: form.targetCountries,
        interestedFields: form.interestedFields,
        preferredIntake: form.preferredIntake,
        maxBudgetUsd: Number(form.maxBudgetUsd),
        englishTest: {
          type: "IELTS",
          score: Number(form.englishTest.score) || 0
        }
      };

      const res = await api.updateProfile(payload);
      setSuccess("Profile updated successfully!");
      // Update local storage session cache with new name
      setSession(localStorage.getItem('sv_token'), res.data);
      setUser(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page skeleton-wrapper" style={{ padding: '24px' }}>
        <div className="skeleton skeleton-title" style={{ width: '30%' }} />
        <div className="skeleton-card" style={{ height: '500px', marginTop: '20px' }} />
      </div>
    );
  }

  const completionPct = calculateCompletion();

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>My Profile</h1>
        <div className="completion-bar-container">
          <div className="completion-label">
            <span>Profile Completion</span>
            <span className="font-bold text-blue-600">{completionPct}%</span>
          </div>
          <div className="progress-track mt-sm">
            <div className="progress-fill bg-blue-500" style={{ width: `${completionPct}%` }}></div>
          </div>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-form-section">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSave}>
            {/* PERSONAL INFO */}
            <div className="form-card">
              <h2 className="form-section-title">Personal Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    className="form-input disabled-input"
                    value={form.email}
                    disabled
                  />
                  <span className="helper-text">Email cannot be changed directly.</span>
                </div>
              </div>
            </div>

            {/* STUDY PREFERENCES */}
            <div className="form-card mt-xl">
              <h2 className="form-section-title">Study Preferences</h2>
              
              <div className="form-group mb-lg">
                <label>Target Countries</label>
                <div className="tags-container">
                  {ALL_COUNTRIES.map(country => (
                    <button
                      type="button"
                      key={country}
                      className={`tag-btn ${form.targetCountries.includes(country) ? 'active' : ''}`}
                      onClick={() => toggleArrayItem('targetCountries', country)}
                    >
                      {country}
                    </button>
                  ))}
                </div>
                <span className="helper-text">Select one or more countries you are interested in.</span>
              </div>

              <div className="form-group mb-lg">
                <label>Interested Fields</label>
                <div className="tags-container">
                  {ALL_FIELDS.map(field => (
                    <button
                      type="button"
                      key={field}
                      className={`tag-btn ${form.interestedFields.includes(field) ? 'active' : ''}`}
                      onClick={() => toggleArrayItem('interestedFields', field)}
                    >
                      {field}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Preferred Intake</label>
                <select 
                  className="form-input"
                  value={form.preferredIntake}
                  onChange={(e) => setForm({ ...form, preferredIntake: e.target.value })}
                >
                  <option value="">Select an intake</option>
                  <option value="Fall 2026">Fall 2026</option>
                  <option value="Spring 2027">Spring 2027</option>
                  <option value="Fall 2027">Fall 2027</option>
                </select>
              </div>
            </div>

            {/* FINANCIAL & LANGUAGE */}
            <div className="form-card mt-xl">
              <h2 className="form-section-title">Financial & Language</h2>
              
              <div className="form-group mb-lg">
                <div className="flex justify-between items-center mb-sm">
                  <label className="mb-0">Maximum Tuition Budget (Per Year)</label>
                  <span className="font-bold text-blue-600">${Number(form.maxBudgetUsd).toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="1000"
                  className="range-slider"
                  value={form.maxBudgetUsd}
                  onChange={(e) => setForm({ ...form, maxBudgetUsd: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>IELTS Score</label>
                <input
                  type="number"
                  min="0"
                  max="9"
                  step="0.5"
                  className="form-input"
                  placeholder="e.g. 7.5"
                  value={form.englishTest.score}
                  onChange={(e) => setForm({ ...form, englishTest: { ...form.englishTest, score: e.target.value } })}
                />
                <span className="helper-text">Leave blank if you haven't taken the test yet.</span>
              </div>
            </div>

            <div className="form-actions mt-xl">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* SIDEBAR PREVIEW */}
        <div className="profile-preview-section">
          <div className="preview-card sticky">
            <h3>Profile Preview</h3>
            
            <div className="preview-avatar">
              {form.fullName ? form.fullName.charAt(0).toUpperCase() : "?"}
            </div>
            <h4 className="preview-name">{form.fullName || "Your Name"}</h4>
            <p className="preview-role">{user?.role || "Student"}</p>

            <div className="preview-divider"></div>

            <div className="preview-details">
              <div className="preview-item">
                <span className="preview-icon">📍</span>
                <div>
                  <strong>Target Destinations</strong>
                  <p>{form.targetCountries.length > 0 ? form.targetCountries.join(", ") : "Not set"}</p>
                </div>
              </div>
              <div className="preview-item">
                <span className="preview-icon">🎓</span>
                <div>
                  <strong>Fields of Study</strong>
                  <p>{form.interestedFields.length > 0 ? form.interestedFields.join(", ") : "Not set"}</p>
                </div>
              </div>
              <div className="preview-item">
                <span className="preview-icon">💰</span>
                <div>
                  <strong>Max Budget</strong>
                  <p>${Number(form.maxBudgetUsd).toLocaleString()}</p>
                </div>
              </div>
              <div className="preview-item">
                <span className="preview-icon">📝</span>
                <div>
                  <strong>IELTS Score</strong>
                  <p>{form.englishTest.score || "Not taken"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
