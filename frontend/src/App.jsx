import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Dashboard from './pages/Home/Dashboard';
import AdminDashboard from './pages/ProjectManager/AdminDashboard';
import ProjectDashboard from './pages/ProjectManager/ProjectDashboard';
import AssignMembers from './pages/ProjectManager/AssignMembers';

function App() {
  return (
    <Router>
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/projectDashboard" element={<ProjectDashboard />} />
          <Route path="/assignLeads" element={<AssignMembers />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
