import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { Toaster } from 'react-hot-toast';
import './App.css';

/**
 * Composant principal de l'application gérant le routage
 */
function App() {
  return (
    <Router>
      {/* Configuration du Toaster pour les notifications globales */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="app-container">
        <Routes>
          {/* Routes publiques */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Route protégée (Dashboard) */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Redirection par défaut vers la page de connexion */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
