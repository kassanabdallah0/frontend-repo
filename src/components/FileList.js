import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FileList = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = () => {
    axios.get('http://localhost:8000/fileupload/list_completed_uploads/')
      .then(response => {
        setFiles(response.data);
      })
      .catch(error => {
        console.error('Error fetching file list:', error);
      });
  };

  const handleDelete = (sessionId) => {
    axios.delete(`http://localhost:8000/fileupload/delete_upload/${sessionId}/`)
      .then(response => {
        console.log(response)
        fetchFiles();
      })
      .catch(error => {
        console.error('Error deleting file:', error);
      });
  };

  return (
    <div className="file-list-container">
      <h1>Completed Uploads</h1>
      <table>
        <thead>
          <tr>
            <th>Session ID</th>
            <th>File Name</th>
            <th>User ID</th>
            <th>Total Chunks</th>
            <th>Date Uploaded</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {files.map(file => (
            <tr key={file.session_id}>
              <td>{file.session_id}</td>
              <td>{file.file_name}</td>
              <td>{file.user_id}</td>
              <td>{file.total_chunks}</td>
              <td>{new Date(file.date_uploaded).toLocaleString()}</td>
              <td>
                <button onClick={() => handleDelete(file.session_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => window.location.href = '/upload'}>Go to Upload Page</button>
    </div>
  );
};

export default FileList;
