import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './components/Home';
import './App.css';
import Signup from './components/SignUp';
import Signin from './components/SignIn';
import Admin from './components/Admin';
import Employee from './components/Employee';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/admin/dashboard" element={<Admin />} />
        <Route path="/" element={<Home />} />
        <Route path="/employee" element={<Employee />} />
      </Routes>
    </Router>
  );
}

export default App;
