import React, { useState, useEffect, useCallback } from 'react';
import UploadZone from './components/UploadZone';
import FiltersPanel from './components/FiltersPanel';
import LogsTable from './components/LogsTable';
import { getLogs } from './services/api';

const defaultMetadata = {
  currentPage: 1,
  totalPages: 1,
  totalRecords: 0,
  limit: 10,
};

/**
 * Main App component representing the Security Audit Log Dashboard application.
 * Manages search/filter, sorting, pagination state and integrates components.
 */
function App() {
  const [logs, setLogs] = useState([]);
  const [metadata, setMetadata] = useState(defaultMetadata);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [fetchError, setFetchError] = useState('');

  /**
   * Fetches audit logs from backend using current search, filters, sorting and page options.
   */
  const fetchLogsData = useCallback(async () => {
    try {
      setFetchError('');
      const params = {
        ...filters,
        sortBy,
        sortOrder,
        page,
        limit,
      };

      const result = await getLogs(params);
      if (result.success) {
        setLogs(result.data || []);
        setMetadata(result.metadata || defaultMetadata);
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
      setFetchError(err.response?.data?.message || err.message || 'Failed to fetch logs from server');
    }
  }, [filters, sortBy, sortOrder, page, limit]);

  // Fetch data on parameters change
  useEffect(() => {
    fetchLogsData();
  }, [fetchLogsData]);

  // Handler when bulk upload succeeds to auto refresh log table view
  const handleUploadSuccess = () => {
    // Reset to first page and reload the logs
    setPage(1);
    fetchLogsData();
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset page to 1 when filters are changed
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      // Toggle sorting direction if same field is clicked
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      // Set to new field and default to descending order
      setSortBy(field);
      setSortOrder('desc');
    }
    setPage(1); // Reset to page 1 on sort change
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset page to 1 on limit/page size change
  };

  return (
    <div className="container">
      <header>
        <h1>Security Audit Log Dashboard</h1>
      </header>

      {/* Upload Section */}
      <UploadZone onUploadSuccess={handleUploadSuccess} />

      {/* Filter and Search Panel */}
      <FiltersPanel onApplyFilters={handleApplyFilters} />

      {/* Backend fetch error alert, if any */}
      {fetchError && (
        <div className="alert alert-danger">
          Error: {fetchError}
        </div>
      )}

      {/* Data Table with sorting/pagination controls */}
      <LogsTable
        logs={logs}
        metadata={metadata}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />
    </div>
  );
}

export default App;
