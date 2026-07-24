import React, { useState, useRef } from 'react';
import { uploadLogsBulk } from '../services/api';

/**
 * UploadZone component handles JSON file selection, parsing, and uploading.
 * @param {Object} props - Callback properties.
 * @param {Function} props.onUploadSuccess - Triggered when bulk upload succeeds.
 */
function UploadZone({ onUploadSuccess }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      setMessage({ text: 'Error: Please upload a valid JSON file (.json)', type: 'danger' });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const json = JSON.parse(e.target.result);
        if (!Array.isArray(json)) {
          setMessage({ text: 'Error: File content must be a JSON array of logs.', type: 'danger' });
          return;
        }

        setLoading(true);
        setMessage({ text: 'Uploading logs...', type: 'info' });

        const result = await uploadLogsBulk(json);
        
        setMessage({ 
          text: `Success: ${result.count || json.length} logs uploaded successfully.`, 
          type: 'success' 
        });

        // Trigger parent state refresh
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || 'Failed to process file';
        const details = err.response?.data?.details;
        let detailedMsg = errorMsg;
        if (details && Array.isArray(details)) {
          detailedMsg += `: ${details.map(d => `${d.path.join('.')}: ${d.message}`).join(', ')}`;
        }
        setMessage({ text: `Error: ${detailedMsg}`, type: 'danger' });
      } finally {
        setLoading(false);
        // Clear input value to allow uploading the same file again if desired
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };

    reader.onerror = () => {
      setMessage({ text: 'Error reading file.', type: 'danger' });
    };

    reader.readAsText(file);
  };

  return (
    <div className="section-card">
      <h2 className="section-title">Upload JSON Logs</h2>
      
      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div 
        className="upload-container"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <p>Drag and drop a <strong>.json</strong> file here, or click to browse</p>
        <input 
          type="file" 
          ref={fileInputRef}
          accept=".json,application/json" 
          onChange={handleFileChange}
          disabled={loading}
        />
      </div>
    </div>
  );
}

export default UploadZone;
