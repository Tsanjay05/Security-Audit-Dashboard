import React from 'react';

/**
 * LogsTable displays a list of log records in a table format with column headers sorting
 * and server-side pagination controllers.
 */
function LogsTable({
  logs,
  metadata,
  sortBy,
  sortOrder,
  onSort,
  onPageChange,
  onLimitChange,
}) {
  const { currentPage, totalPages, totalRecords, limit } = metadata;

  const handleHeaderClick = (field) => {
    if (onSort) {
      onSort(field);
    }
  };

  const renderSortIndicator = (field) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? ' ▲' : ' ▼';
  };

  const getSeverityClass = (severity = '') => {
    const s = severity.toUpperCase();
    if (s.includes('LOW')) return 'badge-low';
    if (s.includes('MEDIUM')) return 'badge-medium';
    if (s.includes('HIGH')) return 'badge-high';
    if (s.includes('CRITICAL')) return 'badge-critical';
    return '';
  };

  const columns = [
    { label: 'Actor', key: 'actor' },
    { label: 'Role', key: 'role' },
    { label: 'Action', key: 'action' },
    { label: 'Resource', key: 'resource' },
    { label: 'Type', key: 'resourceType' },
    { label: 'IP Address', key: 'ipAddress' },
    { label: 'Region', key: 'region' },
    { label: 'Severity', key: 'severity' },
    { label: 'Status', key: 'status' },
    { label: 'Timestamp', key: 'timestamp' },
  ];

  return (
    <div className="section-card">
      <h2 className="section-title">Audit Logs</h2>

      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <label htmlFor="limit-select" style={{ margin: 0 }}>Show entries:</label>
        <select
          id="limit-select"
          style={{ width: '80px' }}
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} onClick={() => handleHeaderClick(col.key)}>
                  {col.label}
                  {renderSortIndicator(col.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs && logs.length > 0 ? (
              logs.map((log, index) => (
                <tr key={log._id || index}>
                  <td>{log.actor}</td>
                  <td>{log.role}</td>
                  <td>{log.action}</td>
                  <td title={log.resource}>{log.resource}</td>
                  <td>{log.resourceType}</td>
                  <td>{log.ipAddress}</td>
                  <td>{log.region}</td>
                  <td>
                    <span className={`badge ${getSeverityClass(log.severity)}`}>
                      {log.severity}
                    </span>
                  </td>
                  <td>{log.status}</td>
                  <td>{log.timestamp ? new Date(log.timestamp).toLocaleString() : ''}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '24px', color: '#6c757d' }}>
                  No audit logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {logs && logs.length > 0 && (
        <div className="pagination-controls">
          <div className="pagination-info">
            Showing Page {currentPage} of {totalPages} ({totalRecords} total records)
          </div>
          
          <div className="pagination-buttons">
            <button
              className="btn btn-secondary"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              Previous
            </button>
            <button
              className="btn btn-secondary"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LogsTable;
