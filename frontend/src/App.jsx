import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './index.css';
import Dashboard from './pages/Home/Dashboard';
import AdminDashboard from './pages/ProjectManager/AdminDashboard';
import ProjectDashboard from './pages/ProjectManager/ProjectDashboard';


function App() {
  return (
    <Router>
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/projectDashboard" element={<ProjectDashboard />} />
        </Routes>
      </div>
    </Router>
 
  );
}

export default App;
