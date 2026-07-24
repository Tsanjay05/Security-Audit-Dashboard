const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema(
  {
    actor: {
      type: String,
      required: true,
      trim: true,
      index: true, // Indexed for filtering and searching
    },
    role: {
      type: String,
      required: true,
      trim: true,
      index: true, // Indexed for filtering
    },
    action: {
      type: String,
      required: true,
      trim: true,
      index: true, // Indexed for filtering and searching
    },
    resource: {
      type: String,
      required: true,
      trim: true,
      index: true, // Indexed for searching
    },
    resourceType: {
      type: String,
      required: true,
      trim: true,
      index: true, // Indexed for filtering
    },
    ipAddress: {
      type: String,
      required: true,
      trim: true,
      index: true, // Indexed for searching
    },
    region: {
      type: String,
      required: true,
      trim: true,
      index: true, // Indexed for filtering
    },
    severity: {
      type: String,
      required: true,
      trim: true,
      index: true, // Indexed for filtering and sorting
    },
    status: {
      type: String,
      required: true,
      trim: true,
      index: true, // Indexed for filtering
    },
    timestamp: {
      type: Date,
      required: true,
      index: true, // Indexed for filtering and sorting (No default value, store exactly as received)
    },
  },
  {
    // Do not auto-generate standard createdAt/updatedAt unless requested, keeping schema lightweight
    timestamps: false,
    versionKey: false,
  }
);

const Log = mongoose.model('Log', LogSchema);

module.exports = Log;
