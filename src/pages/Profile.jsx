import React from 'react';
import { User, Award, ShieldCheck, Zap } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './Profile.css';

const Profile = () => {
  const { user, credits, teachTags } = useAppContext();

  const stats = [
    { label: 'Sessions Completed', value: '42', icon: Zap, color: 'var(--hsl-accent)' },
    { label: 'Success Rate', value: '96%', icon: ShieldCheck, color: '120, 70%, 60%' },
    { label: 'Total Credits Earned', value: '1,240', icon: Award, color: 'var(--hsl-primary)' }
  ];

  return (
    <div className="profile-page animate-fade-in">
      <header className="mb-4">
        <h1 className="h1 flex-align"><User className="text-gradient" /> Proof of Knowledge</h1>
      </header>

      <div className="profile-header card glass">
        <div className="profile-avatar">
          {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="profile-info">
          <h2 className="h2">@{user?.username || 'Student'}</h2>
          <p className="text-muted">Pyxora Scholar • Joined recently</p>
          <div className="credits-display mt-2">
            <span className="credits-icon">💎</span>
            <span className="credits-amount h3 m-0">{credits} Available Credits</span>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card card">
            <div className="stat-icon-wrapper" style={{ background: `hsla(${stat.color}, 0.1)`, color: `hsl(${stat.color})` }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-details">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="proof-section mt-4">
        <h3 className="h3 mb-4">Verified Teaching Impact</h3>
        <div className="impact-list">
          {teachTags.length > 0 ? teachTags.map((tag, idx) => (
            <div key={idx} className="impact-card card">
              <div className="impact-header">
                <h4>{tag}</h4>
                <span className="badge badge-primary">Level {Math.floor(Math.random() * 5) + 1}</span>
              </div>
              <p className="text-sm text-muted mb-2">Helped {Math.floor(Math.random() * 20) + 1} students master this topic.</p>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${Math.floor(Math.random() * 50) + 50}%`, background: 'var(--gradient-primary)' }}
                ></div>
              </div>
            </div>
          )) : (
            <p className="text-muted">Add topics you can teach on the dashboard to start building your proof of knowledge!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
