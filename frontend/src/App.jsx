import { useState } from 'react';
import './App.css';
import SideBar from './components/Other/sideBar'; // Capitalized component name
import Card from './components/Other/card';
import './index.css';
import Loader from './components/Other/Loader';
import Navbar from './components/Other/NavBar';
import Dashboard from './pages/Dashboard/Dashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';

function App() {
  return (
    <>
      {/* <Dashboard /> */}
      <AdminDashboard />
    </>
  );
}

export default App;
