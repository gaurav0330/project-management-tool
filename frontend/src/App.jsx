import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './index.css';
import Loader from './components/Other/Loader';
import Navbar from './components/Other/NavBar';
import Dashboard from './pages/Home/Dashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';


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
        </Routes>
      </div>
    </Router>
 
>>>>>>> b22c77d7b76efcaef56e8f216ad3597238e59c66
  );
}

export default App;
