import { useState } from 'react';
import './App.css';
import SideBar from './components/Other/sideBar'; // Capitalized component name
import Card from './components/Other/card';

function App() {
  return (
    <>
      <SideBar /> {/* Capitalized component usage */}
      <Card title="Card Title" content="Card Content" />
    </>
  );
}

export default App;
