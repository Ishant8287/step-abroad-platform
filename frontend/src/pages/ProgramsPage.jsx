import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import "./ProgramsPage.css";

const COUNTRIES = ["Canada", "UK", "Australia", "UAE", "USA"];
const DEGREE_LEVELS = ["Bachelor", "Master", "Diploma", "Certificate"];

export default function ProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    q: "",
    countries: [],
    degreeLevel: "",
    scholarship: false,
    maxTuition: 50000,
    sortBy: "popular"
  });

  const load = async () => {
    setLoading(true);
    // Convert array filters to strings for API if needed, but for now we just pass q
    // In a real app we'd map all filters to API params
    const res = await api.programs({ q: filters.q, limit: 15 });
    
    // Simulate frontend filtering for demo purposes since backend might not support all these filters natively yet
    let filtered = res.data;
    
    if (filters.countries.length > 0) {
      filtered = filtered.filter(p => filters.countries.includes(p.country));
    }
    
    if (filters.degreeLevel) {
      filtered = filtered.filter(p => p.degreeLevel.toLowerCase() === filters.degreeLevel.toLowerCase());
    }
    
    if (filters.maxTuition < 100000) {
      filtered = filtered.filter(p => p.tuitionFeeUsd <= filters.maxTuition);
    }
    
    setPrograms(filtered);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [filters.countries, filters.degreeLevel, filters.maxTuition, filters.scholarship, filters.sortBy]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      load();
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.q]);

  const handleCountryToggle = (country) => {
    setFilters(prev => {
      if (prev.countries.includes(country)) {
        return { ...prev, countries: prev.countries.filter(c => c !== country) };
      }
      return { ...prev, countries: [...prev.countries, country] };
    });
  };

  const getCountryFlag = (country) => {
    const map = { "Canada": "🇨🇦", "UK": "🇬🇧", "Australia": "🇦🇺", "UAE": "🇦🇪", "USA": "🇺🇸" };
    return map[country] || "🌍";
  };

  return (
    <div className="programs-page">
      {/* ─── Sidebar Filters ─────────────────────────────────── */}
      <aside className="filters-sidebar">
        <div className="filter-group">
          <h3 className="filter-title">Search</h3>
          <input
            type="text"
            className="filter-input search-input"
            placeholder="Search programs..."
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          />
        </div>

        <div className="filter-group">
          <h3 className="filter-title">Country</h3>
          <div className="filter-options">
            {COUNTRIES.map(country => (
              <label key={country} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.countries.includes(country)}
                  onChange={() => handleCountryToggle(country)}
                />
                <span className="checkbox-text">{getCountryFlag(country)} {country}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h3 className="filter-title">Degree Level</h3>
          <div className="filter-options">
            <label className="radio-label">
              <input
                type="radio"
                name="degree"
                checked={filters.degreeLevel === ""}
                onChange={() => setFilters({ ...filters, degreeLevel: "" })}
              />
              <span className="radio-text">All Levels</span>
            </label>
            {DEGREE_LEVELS.map(level => (
              <label key={level} className="radio-label">
                <input
                  type="radio"
                  name="degree"
                  checked={filters.degreeLevel === level}
                  onChange={() => setFilters({ ...filters, degreeLevel: level })}
                />
                <span className="radio-text">{level}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h3 className="filter-title">Max Tuition (USD)</h3>
          <div className="tuition-slider-container">
            <span className="tuition-value">${Number(filters.maxTuition).toLocaleString()}</span>
            <input
              type="range"
              min="5000"
              max="100000"
              step="5000"
              className="range-slider"
              value={filters.maxTuition}
              onChange={(e) => setFilters({ ...filters, maxTuition: e.target.value })}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$5k</span>
              <span>$100k+</span>
            </div>
          </div>
        </div>

        <div className="filter-group">
          <label className="toggle-label">
            <span className="filter-title mb-0">Scholarships Available</span>
            <div className={`toggle-switch ${filters.scholarship ? 'on' : 'off'}`} onClick={() => setFilters({...filters, scholarship: !filters.scholarship})}>
              <div className="toggle-knob"></div>
            </div>
          </label>
        </div>
      </aside>

      {/* ─── Main Content ────────────────────────────────────── */}
      <main className="programs-main">
        <div className="results-header">
          <div className="results-count">
            Showing <strong>{programs.length}</strong> programs
          </div>
          <div className="sort-control">
            <label>Sort by:</label>
            <select
              className="sort-select"
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            >
              <option value="popular">Most Popular</option>
              <option value="tuition_asc">Tuition: Low to High</option>
              <option value="tuition_desc">Tuition: High to Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-3 gap-lg">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="program-card skeleton-card-wrapper">
                <div className="skeleton-card" style={{ height: "100%" }}></div>
              </div>
            ))}
          </div>
        ) : programs.length > 0 ? (
          <>
            <div className="grid grid-3 gap-lg programs-grid">
              {programs.map((p) => (
                <div key={p._id} className="program-card">
                  <div className="card-top">
                    <div className="uni-logo-placeholder">
                      {p.universityName?.charAt(0) || "U"}
                    </div>
                    <div className="card-badges">
                      <span className="degree-badge">{p.degreeLevel}</span>
                      {Math.random() > 0.5 && <span className="scholarship-badge">💰 Scholarship</span>}
                    </div>
                  </div>
                  
                  <h3 className="prog-card-title">{p.title}</h3>
                  <p className="uni-name-card">{p.universityName}</p>
                  <p className="country-card">{getCountryFlag(p.country)} {p.country}</p>
                  
                  <div className="prog-details-card">
                    <div className="tuition-highlight">
                      ${p.tuitionFeeUsd?.toLocaleString()} <span>/ year</span>
                    </div>
                    <div className="intake-chips">
                      {p.intakes?.slice(0, 2).map(intake => (
                        <span key={intake} className="intake-chip">{intake}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="card-actions">
                    <Link to={`/dashboard/programs/${p._id}`} className="btn-outline">View Details</Link>
                    <button className="btn-primary">Apply</button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pagination">
              <button className="page-btn disabled">Previous</button>
              <button className="page-btn active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">3</button>
              <button className="page-btn">Next</button>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No programs found</h3>
            <p>Try adjusting your filters to see more results.</p>
            <button 
              className="btn-primary mt-md"
              onClick={() => setFilters({ q: "", countries: [], degreeLevel: "", scholarship: false, maxTuition: 100000, sortBy: "popular" })}
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
