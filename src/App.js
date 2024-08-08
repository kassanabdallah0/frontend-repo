import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/upload" element={<FileUpload />} />
        <Route path="/file-list" element={<FileList />} />
        <Route path="/" element={<FileUpload />} />
      </Routes>
    </Router>
  );
}

export default App;
