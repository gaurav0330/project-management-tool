import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './index.css';
import Dashboard from './pages/Home/Dashboard';
import AdminDashboard from './pages/ProjectManager/AdminDashboard';
import ProjectDashboard from './pages/ProjectManager/ProjectDashboard';
import AssignMembers from './pages/ProjectManager/AssignMembers';


function App() {
  return (
<<<<<<< HEAD
    <>
<<<<<<< HEAD
    {/* <Navbar />
      <SideBar /> {/* Capitalized component usage */}
      {/* <Card title="Card Title" content="Card Content" />
      <Loader /> */} 
      <Dashboard />
=======
      <Card title="Card Title" content="Card Content" />
>>>>>>> origin/master
    </>
=======
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
 
>>>>>>> b22c77d7b76efcaef56e8f216ad3597238e59c66
  );
}

export default App;
