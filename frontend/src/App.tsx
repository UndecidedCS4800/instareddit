import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, BrowserRouter, } from 'react-router-dom';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import About from './About'; // Import the About component
//import './About.css';
import NavBar from './NavBar';
// import Login from './Login';
// import Register from './Register';
import AllTables from './AllTables';
import Login from './Login';

const App: React.FC = () => {

  return (
    <BrowserRouter>
      <div> 
        {/* use navbar */}
        <NavBar />
      {/*
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
          </ul>
        </nav>
  */}

        <Routes>
          {/* Home Route */}
          <Route
            path="/"
            element={
              <AllTables />
            }
          />
          {/* About Us Route */}
          <Route path="/about" element={<About />} />

          {/* Login Route */}
          <Route path="/login" element={<Login />} />

          {/* <Route path="/register" element={<Register />} /> */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
