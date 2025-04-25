import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import LoginSignup from './pages/LoginSignup/LoginSignup';
import Dashboard from './components/Dashboard/dashboard';
import AddExpenses from './pages/add-expenses/addexpenses';
import reportWebVitals from './reportWebVitals';
import AddSavingsGoal from './pages/add-savings-goal/addsavingsgoal';
import MainPage from './pages/Mainpage/mainpage';
import Profile from './pages/profile/profile'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/loginsignup" element={<LoginSignup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/addexpenses" element={<AddExpenses/>}/>
        <Route path="/addsavingsgoal" element={<AddSavingsGoal/>}/>
        <Route path="/profile" element={<Profile/>}/>
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
