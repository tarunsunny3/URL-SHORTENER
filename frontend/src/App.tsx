import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import 'chart.js/auto';
import AuthService from './services/auth.service';
import IUser from './types/user.type';
import Login from './components/LoginComponent/login.component';
import Register from './components/RegisterComponent/register.component';
import Home from './components/HomeComponent/home.component';
import UserDashboard from './components/UserDashboard/userdashboard.component';
import UrlAnalytics from './components/UrlAnalyticsComponent/urlAnalytics.component';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './common/AuthContext/AuthContext';

const App: React.FC = () => {
  const { currentUser, logout } = useAuth();

  // useEffect(() => {
  //   const user = AuthService.getCurrentUser();
  //   if (user) {
  //     // Do something with the user if needed
  //   }
  // }, []);

  return (
    <div>
      <nav className="navbar navbar-expand bg-white">
        <Link to={'/'} className="navbar-brand">
          miniURL
        </Link>

        {currentUser ? (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={'/dashboard'} className="nav-link">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <button className="nav-link" onClick={logout}>
                LogOut
              </button>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={'/login'} className="nav-link">
                Login
              </Link>
            </li>

            <li className="nav-item">
              <Link to={'/register'} className="nav-link">
                Sign Up
              </Link>
            </li>
          </div>
        )}
      </nav>

      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <UrlAnalytics />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
