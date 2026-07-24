const { z } = require('zod');

// Schema for individual audit log records validation
const singleLogSchema = z.object({
  actor: z.string({ required_error: 'Actor is required' }).min(1, 'Actor cannot be empty'),
  role: z.string({ required_error: 'Role is required' }).min(1, 'Role cannot be empty'),
  action: z.string({ required_error: 'Action is required' }).min(1, 'Action cannot be empty'),
  resource: z.string({ required_error: 'Resource is required' }).min(1, 'Resource cannot be empty'),
  resourceType: z.string({ required_error: 'ResourceType is required' }).min(1, 'ResourceType cannot be empty'),
  ipAddress: z.string({ required_error: 'IP Address is required' }).min(1, 'IP Address cannot be empty'),
  region: z.string({ required_error: 'Region is required' }).min(1, 'Region cannot be empty'),
  severity: z.string({ required_error: 'Severity is required' }).min(1, 'Severity cannot be empty'),
  status: z.string({ required_error: 'Status is required' }).min(1, 'Status cannot be empty'),
  timestamp: z.string({ required_error: 'Timestamp is required' })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Timestamp must be a valid ISO 8601 date string',
    }),
});

// Schema for validating the bulk array payload
const bulkLogSchema = z.array(singleLogSchema);

module.exports = {
  singleLogSchema,
  bulkLogSchema,
};
