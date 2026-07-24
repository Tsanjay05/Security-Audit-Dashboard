const express = require('express');
const logController = require('../controllers/logController');

const router = express.Router();

// Route for bulk uploading audit log records
router.post('/logs/bulk', logController.bulkUploadLogs);

// Route for fetching, filtering, searching, and paginating audit logs
router.get('/logs', logController.getLogs);

module.exports = router;
