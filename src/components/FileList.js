import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Définir le composant FileList
const FileList = () => {
  // État contenant la liste des fichiers
  const [files, setFiles] = useState([]);

  // useEffect hook pour récupérer les fichiers lors du montage du composant
  useEffect(() => {
    fetchFiles();
  }, []);

  // Fonction permettant de récupérer la liste des téléchargements terminés depuis le backend
  const fetchFiles = () => {
    axios.get('http://localhost:8000/fileupload/list_completed_uploads/')
      .then(response => {
        // Mise à jour de l'état avec les données récupérées
        setFiles(response.data);
      })
      .catch(error => {
        console.error('Error fetching file list:', error);
      });
  };

  // Fonction de suppression de fichiers
  const handleDelete = (sessionId) => {
    axios.delete(`http://localhost:8000/fileupload/delete_upload/${sessionId}/`)
      .then(response => {
        // Actualiser la liste des fichiers après leur suppression
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
            <th>File Size (MB)</th>
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
              <td>{(file.file_size / (1024 * 1024)).toFixed(2)}</td>
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
