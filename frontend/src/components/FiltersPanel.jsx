import React, { useState } from 'react';

const initialFilters = {
  search: '',
  severity: '',
  status: '',
  role: '',
  resourceType: '',
  region: '',
  startDate: '',
  endDate: '',
};

/**
 * FiltersPanel handles dashboard query filter configuration.
 * @param {Object} props - Callback properties.
 * @param {Function} props.onApplyFilters - Callback when filters are applied.
 */
function FiltersPanel({ onApplyFilters }) {
  const [filters, setFilters] = useState(initialFilters);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onApplyFilters(filters);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    onApplyFilters(initialFilters);
  };

  return (
    <div className="section-card">
      <h2 className="section-title">Search & Filter Logs</h2>
      
      <form onSubmit={handleSearchSubmit}>
        {/* Search row */}
        <div className="form-group">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            type="text"
            name="search"
            placeholder="Search text in actor, action, resource, or ipAddress..."
            value={filters.search}
            onChange={handleInputChange}
          />
        </div>

        {/* Filter controls row 1 */}
        <div className="form-row">
          <div className="form-col">
            <label htmlFor="severity">Severity</label>
            <input
              id="severity"
              type="text"
              name="severity"
              placeholder="e.g. HIGH"
              value={filters.severity}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-col">
            <label htmlFor="status">Status</label>
            <input
              id="status"
              type="text"
              name="status"
              placeholder="e.g. Unresolved"
              value={filters.status}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-col">
            <label htmlFor="role">Role</label>
            <input
              id="role"
              type="text"
              name="role"
              placeholder="e.g. admin"
              value={filters.role}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-col">
            <label htmlFor="resourceType">Resource Type</label>
            <input
              id="resourceType"
              type="text"
              name="resourceType"
              placeholder="e.g. USER"
              value={filters.resourceType}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Filter controls row 2 */}
        <div className="form-row">
          <div className="form-col">
            <label htmlFor="region">Region</label>
            <input
              id="region"
              type="text"
              name="region"
              placeholder="e.g. ap-south-1"
              value={filters.region}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-col">
            <label htmlFor="startDate">Start Date</label>
            <input
              id="startDate"
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-col">
            <label htmlFor="endDate">End Date</label>
            <input
              id="endDate"
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <button type="submit" className="btn btn-primary">
            Apply Filters
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

export default FiltersPanel;
