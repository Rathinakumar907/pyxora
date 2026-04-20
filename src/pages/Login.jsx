import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [isJoin, setIsJoin] = useState(false);
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      login(username);
      navigate('/');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card card glass animate-fade-in">
        <div className="login-header">
          <div className="logo-sparkle pulse-animation">
            <Sparkles size={32} color="hsl(var(--hsl-primary))" />
          </div>
          <h1 className="h1 text-gradient">Pyxora</h1>
          <p className="text-sm">Learn, teach, earn, and prove your knowledge.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter username"
              className="input-base"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <input
              type="password"
              placeholder="Enter password (any will do)"
              className="input-base"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary login-btn">
            {isJoin ? 'Create Account' : 'Enter Pyxora'}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="login-footer">
          <button 
            className="toggle-mode-btn"
            onClick={() => setIsJoin(!isJoin)}
          >
            {isJoin ? 'Already have an account? Log in' : 'New here? Join Pyxora'}
          </button>
        </div>
      </div>
      
      <div className="bg-elements">
        <div className="bg-orb orb-1"></div>
        <div className="bg-orb orb-2"></div>
      </div>
    </div>
  );
};

export default Login;
