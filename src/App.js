import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';

// Define the main App component
function App() {
  return (
    <Router>
      <Routes>
        {/* Define a route for the file upload component */}
        <Route path="/upload" element={<FileUpload />} />
        {/* Define a route for the file list component */}
        <Route path="/file-list" element={<FileList />} />
        {/* Define the default route, which redirects to the file upload component */}
        <Route path="/" element={<FileUpload />} />
      </Routes>
    </Router>
  );
}

// Export the App component as the default export
export default App;
