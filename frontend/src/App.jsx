import { useState } from 'react';
import './App.css';
import SideBar from './components/Other/sideBar'; // Capitalized component name
import Card from './components/Other/card';
import './index.css';
import Loader from './components/Other/Loader';
import Navbar from './components/Other/NavBar';
import Dashboard from './pages/Dashboard/Dashboard';

function App() {
  return (
    <>
    {/* <Navbar />
      <SideBar /> {/* Capitalized component usage */}
      {/* <Card title="Card Title" content="Card Content" />
      <Loader /> */} 
      <Dashboard />
    </>
  );
}

export default App;
