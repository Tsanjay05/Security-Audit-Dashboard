const { bulkLogSchema } = require('../validators/logValidator');
const logService = require('../services/logService');

/**
 * Controller layer handling log-related request endpoints.
 */
class LogController {
  /**
   * Controller to bulk upload audit log records.
   * Handles request body parsing, triggers validation, and invokes the service layer.
   */
  bulkUploadLogs = async (req, res, next) => {
    try {
      // Validate request body array against bulk log Zod schema
      const validatedLogs = bulkLogSchema.parse(req.body);

      // Perform bulk database insertion
      const insertedRecords = await logService.bulkInsertLogs(validatedLogs);

      // Return standard response listing successful operation metrics
      return res.status(201).json({
        success: true,
        message: 'Audit logs uploaded successfully',
        count: insertedRecords.length,
      });
    } catch (error) {
      // Pass any validation/database exceptions directly to Express global error handler
      next(error);
    }
  };

  /**
   * Controller to fetch audit logs based on query parameters.
   * Extracts filters, search string, and sorting/pagination options, then queries service layer.
   */
  getLogs = async (req, res, next) => {
    try {
      const {
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
        sortBy,
        sortOrder,
        page,
        limit,
      } = req.query;

      // Request data from service layer
      const results = await logService.getLogs({
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
        sortBy,
        sortOrder,
        page,
        limit,
      });

      // Send response back to the client
      return res.status(200).json({
        success: true,
        metadata: results.metadata,
        data: results.data,
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new LogController();
