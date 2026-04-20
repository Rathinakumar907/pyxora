import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import Navigation from './components/Navigation';

// Page Placeholders
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Session from './pages/Session';
import FocusRoom from './pages/FocusRoom';
import PeerLabs from './pages/PeerLabs';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children }) => {
  const { user } = useAppContext();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

const AppContent = () => {
  const { user } = useAppContext();

  return (
    <Router>
      <div className="app-container">
        {user && <Navigation />}
        <main className={`main-content ${!user ? 'full-width' : ''}`} style={{ marginLeft: user ? '240px' : '0', width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/session" element={
              <ProtectedRoute>
                <Session />
              </ProtectedRoute>
            } />
            
            <Route path="/focus" element={
              <ProtectedRoute>
                <FocusRoom />
              </ProtectedRoute>
            } />
            
            <Route path="/labs" element={
              <ProtectedRoute>
                <PeerLabs />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
