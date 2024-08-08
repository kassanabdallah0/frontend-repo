import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import './FileUpload.css';

const CHUNK_SIZE = 1024 * 1024; // 1MB
const BASE_URL = 'http://localhost:8000';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [metadata, setMetadata] = useState({ totalChunks: 0, uploadedChunks: 0, startTime: null, endTime: null, estimatedTime: null });
  const [assemblyStatus, setAssemblyStatus] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
    setUploadProgress(0);
    setError(null);
    setIsUploading(false);
    setMetadata({ totalChunks: 0, uploadedChunks: 0, startTime: null, endTime: null, estimatedTime: null });
    setAssemblyStatus(null);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: false });

  const uploadChunk = async (chunk, sessionId, chunkNumber, totalChunks, fileSize) => {
    const formData = new FormData();
    formData.append('chunk', chunk);
    formData.append('sessionId', sessionId);
    formData.append('chunkNumber', chunkNumber);
    formData.append('totalChunks', totalChunks);
    formData.append('fileName', file.name);
    formData.append('fileSize', fileSize); // Add file size
    try {
      await axios.post(`${BASE_URL}/fileupload/upload_chunk/`, formData, {
        timeout: 60000,  // 60 seconds timeout
      });
      setMetadata(prevMetadata => ({ ...prevMetadata, uploadedChunks: chunkNumber }));
    } catch (error) {
      console.error('Error uploading chunk:', error);
      throw error;  // re-throw the error to be caught in handleUpload
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);

    const newSessionId = Date.now(); // Example session ID, you can generate a more complex one
    setSessionId(newSessionId);
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const fileSize = file.size;

    setMetadata({ totalChunks, uploadedChunks: 0, startTime: new Date(), endTime: null, estimatedTime: null });
    setUploadProgress(0);
    setError(null);

    const startTime = new Date();

    try {
      for (let i = 0; i < totalChunks; i++) {
        const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
        await uploadChunk(chunk, newSessionId, i + 1, totalChunks, fileSize);

        // Calculate and update upload progress and estimated time
        const elapsedTime = (new Date() - startTime) / 1000; // seconds
        const progress = ((i + 1) / totalChunks) * 100;
        const estimatedTime = ((elapsedTime / (i + 1)) * (totalChunks - (i + 1))).toFixed(2);

        setUploadProgress(progress);
        setMetadata(prevMetadata => ({ ...prevMetadata, estimatedTime }));
      }

      // Notify backend that all chunks have been uploaded
      await axios.post(`${BASE_URL}/fileupload/complete_upload/`, { sessionId: newSessionId, fileName: file.name });

      setMetadata(prevMetadata => ({ ...prevMetadata, endTime: new Date() }));
      setUploadProgress(100);
      pollAssemblyStatus(newSessionId);
    } catch (error) {
      console.error('Error during file upload:', error);
      setError('File upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const pollAssemblyStatus = async (sessionId) => {
    try {
      const response = await axios.get(`${BASE_URL}/fileupload/assembly_status/${sessionId}/`);
      setAssemblyStatus(response.data.status);
      if (response.data.status === 'in_progress') {
        setTimeout(() => pollAssemblyStatus(sessionId), 2000);
      }
    } catch (error) {
      console.error('Error checking assembly status:', error);
      setError('Error checking assembly status. Please try again.');
    }
  };

  return (
    <div className="file-upload-container">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop a file here, or click to select a file</p>
      </div>
      {file && (
        <div className="file-details">
          <p>Selected file: {file.name}</p>
          <p>File size: {(file.size / (1024 * 1024)).toFixed(2)} MB</p>
          <button onClick={handleUpload} disabled={isUploading}>Upload</button>
        </div>
      )}
      <div className="progress-container">
        <progress value={uploadProgress} max="100"></progress>
        {uploadProgress > 0 && <p>Upload progress: {uploadProgress.toFixed(2)}%</p>}
      </div>
      {error && <div className="error-message" style={{ color: 'red' }}>{error}</div>}
      {metadata.totalChunks > 0 && (
        <div className="metadata">
          <p>Total Chunks: {metadata.totalChunks}</p>
          <p>Uploaded Chunks: {metadata.uploadedChunks}</p>
          {metadata.estimatedTime && (
            <p>Estimated Time Remaining: {metadata.estimatedTime} seconds</p>
          )}
          {metadata.endTime && (
            <p>Upload Time: {(metadata.endTime - metadata.startTime) / 1000} seconds</p>
          )}
        </div>
      )}
      {assemblyStatus && (
        <div className="assembly-status">
          <p>Assembly Status: {assemblyStatus}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
