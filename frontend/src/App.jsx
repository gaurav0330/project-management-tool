import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './index.css';
import Loader from './components/Other/Loader';
import Navbar from './components/Other/NavBar';
import Dashboard from './pages/Home/Dashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Navbar from './components/Other/NavBar';
import Project from './components/Other/card';

function App() {
  return (
      <Dashboard />
      <Card title="Card Title" content="Card Content" />
    <Router>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
