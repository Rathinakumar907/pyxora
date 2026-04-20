import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, ArrowRight, X, Edit2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './Dashboard.css';

const EditableTag = ({ tag, type, onRemove, onUpdate, allTags }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState(tag);
  const [isRemoving, setIsRemoving] = useState(false);

  const startEdit = () => { 
    setIsEditing(true); 
    setVal(tag); 
  };
  
  const finishEdit = () => {
    const trimmedVal = val.trim();
    if (trimmedVal === tag) {
      setIsEditing(false);
      return;
    }
    if (trimmedVal === '') {
      handleRemove();
      return;
    }
    if (allTags.includes(trimmedVal)) {
      alert('Skill already exists!');
      setVal(tag);
      setIsEditing(false);
      return;
    }
    onUpdate(tag, trimmedVal);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') finishEdit();
    if (e.key === 'Escape') {
      setVal(tag);
      setIsEditing(false);
    }
  };

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(tag);
    }, 250); // matches transition time
  };

  if (isEditing) {
    return (
      <input
        autoFocus
        type="text"
        className={`editable-tag-input badge badge-${type}`}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={finishEdit}
        onKeyDown={handleKeyDown}
      />
    );
  }

  return (
    <div className={`editable-tag-wrapper badge badge-${type} ${isRemoving ? 'tag-removing' : ''}`}>
      <span className="tag-text">{tag}</span>
      <div className="tag-actions">
        <button type="button" className="action-btn edit-btn" onClick={startEdit} title="Edit skill">
          <Edit2 size={12} />
        </button>
        <button type="button" className="action-btn delete-btn" onClick={handleRemove} title="Remove skill">
          <X size={12} />
        </button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { 
    user, 
    teachTags, addTeachTag, removeTeachTag, updateTeachTag,
    learnTags, addLearnTag, removeLearnTag, updateLearnTag 
  } = useAppContext();
  
  const [newTeach, setNewTeach] = useState('');
  const [newLearn, setNewLearn] = useState('');
  
  const navigate = useNavigate();

  const handleAddTeach = (e) => {
    e.preventDefault();
    const val = newTeach.trim();
    if (val) {
      if (teachTags.includes(val)) {
        alert('Skill already exists!');
      } else {
        addTeachTag(val);
        setNewTeach('');
      }
    }
  };

  const handleAddLearn = (e) => {
    e.preventDefault();
    const val = newLearn.trim();
    if (val) {
      if (learnTags.includes(val)) {
        alert('Skill already exists!');
      } else {
        addLearnTag(val);
        setNewLearn('');
      }
    }
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
            {teachTags.length === 0 ? (
              <p className="empty-state-text text-muted">No skills added yet</p>
            ) : (
              teachTags.map(tag => (
                <EditableTag 
                  key={`teach-${tag}`} 
                  tag={tag} 
                  type="teach" 
                  allTags={teachTags}
                  onRemove={removeTeachTag} 
                  onUpdate={updateTeachTag} 
                />
              ))
            )}
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
            {learnTags.length === 0 ? (
              <p className="empty-state-text text-muted">No skills added yet</p>
            ) : (
              learnTags.map(tag => (
                <EditableTag 
                  key={`learn-${tag}`} 
                  tag={tag} 
                  type="learn" 
                  allTags={learnTags}
                  onRemove={removeLearnTag} 
                  onUpdate={updateLearnTag} 
                />
              ))
            )}
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
