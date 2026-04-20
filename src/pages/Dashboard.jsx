import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user, teachTags, learnTags, addTeachTag, addLearnTag } = useAppContext();
  const [newTeach, setNewTeach] = useState('');
  const [newLearn, setNewLearn] = useState('');
  
  const navigate = useNavigate();

  const handleAddTeach = (e) => {
    e.preventDefault();
    if (newTeach) { addTeachTag(newTeach); setNewTeach(''); }
  };

  const handleAddLearn = (e) => {
    e.preventDefault();
    if (newLearn) { addLearnTag(newLearn); setNewLearn(''); }
  };

  return (
    <div className="dashboard animate-fade-in">
      <header className="dashboard-header">
        <div>
          <h1 className="h1">Welcome back, <span className="text-gradient">{user?.username}</span></h1>
          <p className="text-sm">Ready to learn, teach, and earn credits today?</p>
        </div>
      </header>

      <div className="tags-grid">
        {/* Teach Section */}
        <section className="card">
          <h2 className="h2 flex-align">What you can TEACH</h2>
          <p className="text-sm mb-4">You'll earn credits when you help others with these topics.</p>
          
          <div className="tags-container">
            {teachTags.map(tag => (
              <span key={`teach-${tag}`} className="badge badge-teach">{tag}</span>
            ))}
          </div>

          <form onSubmit={handleAddTeach} className="add-tag-form">
            <div className="input-with-icon">
              <Plus size={16} className="input-icon" />
              <input 
                type="text" 
                className="input-base" 
                placeholder="Add a new skill..." 
                value={newTeach}
                onChange={(e) => setNewTeach(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-secondary">Add</button>
          </form>
        </section>

        {/* Learn Section */}
        <section className="card">
          <h2 className="h2 flex-align">What you want to LEARN</h2>
          <p className="text-sm mb-4">We'll use these to match you with top tutors instantly.</p>
          
          <div className="tags-container">
            {learnTags.map(tag => (
              <span key={`learn-${tag}`} className="badge badge-learn">{tag}</span>
            ))}
          </div>

          <form onSubmit={handleAddLearn} className="add-tag-form">
            <div className="input-with-icon">
              <Search size={16} className="input-icon" />
              <input 
                type="text" 
                className="input-base" 
                placeholder="Find a subject..." 
                value={newLearn}
                onChange={(e) => setNewLearn(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-secondary">Add</button>
          </form>
        </section>
      </div>

      <div className="dashboard-actions mt-4 text-center">
        <button className="btn btn-primary btn-cta" onClick={() => navigate('/session')}>
          Go to Sessions <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
