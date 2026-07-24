const Log = require('../models/Log');

/**
 * Service layer containing business/database operations for Audit Logs.
 */
class LogService {
  /**
   * Performs bulk insertion of validated log records using MongoDB's insertMany.
   * @param {Array<Object>} logs - Array of validated log records.
   * @returns {Promise<Array<Object>>} - Array of inserted log documents.
   */
  async bulkInsertLogs(logs) {
    const result = await Log.insertMany(logs, { ordered: true });
    return result;
  }

  /**
   * Retrieves a paginated list of audit logs based on query parameters.
   * Performs searching, filtering, sorting, and pagination on MongoDB.
   * @param {Object} params - Query criteria options.
   * @returns {Promise<Object>} - Contains data array and pagination metadata object.
   */
  async getLogs({
    search,
    actor,
    role,
    action,
    resourceType,
    severity,
    status,
    region,
    startDate,
    endDate,
    sortBy = 'timestamp',
    sortOrder = 'desc',
    page = 1,
    limit = 10,
  }) {
    const filterQuery = {};

    // 1. Text searching across relevant fields
    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filterQuery.$or = [
        { actor: searchRegex },
        { action: searchRegex },
        { resource: searchRegex },
        { ipAddress: searchRegex },
      ];
    }

    // 2. Exact match filtering for specific fields
    const exactFilters = { actor, role, action, resourceType, severity, status, region };
    Object.keys(exactFilters).forEach((key) => {
      if (exactFilters[key] !== undefined && exactFilters[key] !== null && exactFilters[key] !== '') {
        filterQuery[key] = exactFilters[key].trim();
      }
    });

    // 3. Date range filter for timestamp
    if (startDate || endDate) {
      filterQuery.timestamp = {};
      if (startDate) {
        filterQuery.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        filterQuery.timestamp.$lte = new Date(endDate);
      }
    }

    // 4. Dynamic Sorting configuration
    const validSortFields = [
      'timestamp',
      'actor',
      'role',
      'action',
      'resource',
      'resourceType',
      'ipAddress',
      'region',
      'severity',
      'status',
    ];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'timestamp';
    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    const sortQuery = { [sortField]: sortDirection };

    // 5. Pagination parsing
    const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
    const parsedLimit = Math.max(parseInt(limit, 10) || 10, 1);
    const skip = (parsedPage - 1) * parsedLimit;

    // Execute queries concurrently to optimize network roundtrips to MongoDB
    const [totalRecords, data] = await Promise.all([
      Log.countDocuments(filterQuery),
      Log.find(filterQuery)
        .sort(sortQuery)
        .skip(skip)
        .limit(parsedLimit)
        .exec(),
    ]);

    const totalPages = Math.ceil(totalRecords / parsedLimit);

    return {
      metadata: {
        totalRecords,
        currentPage: parsedPage,
        totalPages,
        limit: parsedLimit,
      },
      data,
    };
  }
}

module.exports = new LogService();
