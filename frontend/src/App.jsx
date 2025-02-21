import { useState } from 'react';
import './App.css';
import Card from './components/Other/card';
import './index.css';
import Loader from './components/Other/Loader';
import Navbar from './components/Other/NavBar';
import Dashboard from './pages/Dashboard/Dashboard';

function App() {
  return (
    <>
      <SideBar /> {/* Capitalized component usage */}
      <Card title="Card Title" content="Card Content" />
    </>
  );
}

export default App;
