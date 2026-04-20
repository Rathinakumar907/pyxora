import React, { useState, useEffect } from 'react';
import { Beaker, BookOpen, CheckCircle, XCircle, Plus, Users, Zap, Award, Star, ArrowLeft } from 'lucide-react';
import './PeerLabs.css';
import { useAppContext } from '../context/AppContext';

// Mock Data
const MOCK_QUESTIONS = [
  {
    question: 'Which of the following is a dynamically typed language?',
    options: ['Java', 'C++', 'Python', 'Go'],
    correct: 2
  },
  {
    question: 'In React, what hook is used to manage component state?',
    options: ['useEffect', 'useState', 'useContext', 'useReducer'],
    correct: 1
  },
  {
    question: 'What is the time complexity of binary search?',
    options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(1)'],
    correct: 2
  },
  {
    question: 'Which CSS property is used to create flexbox layouts?',
    options: ['display: grid', 'display: block', 'display: flex', 'float: left'],
    correct: 2
  },
  {
    question: 'What does API stand for?',
    options: ['Application Programming Interface', 'Active Page Include', 'Automated Program Integration', 'Advanced Processing Item'],
    correct: 0
  }
];

const INITIAL_LABS = [
  { id: '1', title: 'Data Structures Lab', topic: 'Computer Science', difficulty: 'Intermediate', members: 45, hostId: 'system' },
  { id: '2', title: 'Organic Chemistry 101', topic: 'Chemistry', difficulty: 'Beginner', members: 12, hostId: 'system' }
];

const PeerLabs = () => {
  const { earnCredits } = useAppContext();
  
  // App State
  const [labs, setLabs] = useState(INITIAL_LABS);
  const [activeLab, setActiveLab] = useState(null); // null means showing list
  
  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newLab, setNewLab] = useState({ title: '', topic: '', difficulty: 'Beginner' });

  // Progress/Stats state per lab
  const [labStats, setLabStats] = useState({});

  // Mode States (inside a lab)
  const [currentMode, setCurrentMode] = useState('menu'); // 'menu', 'quiz', 'teach'
  
  // Quiz State
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState(0); // number of correct answers
  
  // Teach State
  const [isTeaching, setIsTeaching] = useState(false);

  // Feedback State
  const [feedback, setFeedback] = useState(null); // { text, type: 'success' | 'credit' }

  // Utils
  const getLabStat = (labId) => labStats[labId] || { attempts: 0, bestScore: 0, creditsEarned: 0 };
  const updateLabStat = (labId, updates) => {
    setLabStats(prev => ({
      ...prev,
      [labId]: { ...getLabStat(labId), ...updates }
    }));
  };
  
  const getLevelInfo = (credits) => {
    if (credits >= 150) return { level: 3, name: 'Master', max: 'MAX', progress: 100 };
    if (credits >= 50) return { level: 2, name: 'Scholar', max: 150, progress: ((credits - 50) / 100) * 100 };
    return { level: 1, name: 'Novice', max: 50, progress: (credits / 50) * 100 };
  };

  const triggerFeedback = (text, type = 'success') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleCreateLab = (e) => {
    e.preventDefault();
    if (!newLab.title || !newLab.topic) return;
    
    const createdLab = {
      id: Math.random().toString(36).substr(2, 9),
      title: newLab.title,
      topic: newLab.topic,
      difficulty: newLab.difficulty,
      members: 1, // just the host initially
      hostId: 'me'
    };
    
    setLabs([createdLab, ...labs]);
    setShowCreateModal(false);
    setNewLab({ title: '', topic: '', difficulty: 'Beginner' });
    triggerFeedback(`Lab "${createdLab.title}" Created!`, 'success');
  };

  const startQuiz = () => {
    setCurrentMode('quiz');
    setIsGenerating(true);
    setQuizQuestions([]);
    setCurrentQIndex(0);
    setQuizScore(0);
    setSelectedAnswer(null);
    
    // Simulate generation
    setTimeout(() => {
      setIsGenerating(false);
      setQuizQuestions([...MOCK_QUESTIONS]); // Clone to trigger re-render
    }, 1500);
  };

  const handleAnswerSelect = (index) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    
    const correct = MOCK_QUESTIONS[currentQIndex].correct;
    if (index === correct) {
      setQuizScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < quizQuestions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setSelectedAnswer(null);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const totalQs = quizQuestions.length;
    // Score Calc
    let earned = 5;
    if (quizScore === totalQs) earned = 20;
    else if (quizScore >= totalQs - 1) earned = 15;
    else if (quizScore >= totalQs - 2) earned = 10;
    
    earnCredits(earned);
    
    const stats = getLabStat(activeLab.id);
    updateLabStat(activeLab.id, {
      attempts: stats.attempts + 1,
      bestScore: Math.max(stats.bestScore, quizScore),
      creditsEarned: stats.creditsEarned + earned
    });

    triggerFeedback(`You scored ${quizScore}/${totalQs} - +${earned} Credits!`, 'credit');
    setCurrentMode('menu');
  };

  const startTeachSession = () => {
    setCurrentMode('teach');
    setIsTeaching(true);
    
    // Simulate 3 seconds teaching
    setTimeout(() => {
      setIsTeaching(false);
      
      const baseReward = 20;
      const gotHighRating = Math.random() > 0.3; // 70% chance for bonus
      const totalReward = baseReward + (gotHighRating ? 10 : 0);
      
      earnCredits(totalReward);
      
      const stats = getLabStat(activeLab.id);
      updateLabStat(activeLab.id, {
        creditsEarned: stats.creditsEarned + totalReward
      });

      triggerFeedback(
        gotHighRating ? `High Rating! +${totalReward} Credits Earned (Teaching Bonus)` : `Session Completed! +${totalReward} Credits`,
        'credit'
      );
      
      setCurrentMode('menu');
    }, 3000);
  };

  return (
    <div className="peer-labs animate-fade-in">
      {!activeLab ? (
        // --- LIST VIEW ---
        <>
          <header className="labs-topbar">
            <div>
              <h1 className="h1 flex-align m-0"><Beaker className="text-gradient" /> Peer Labs</h1>
              <p className="text-muted">Join community labs or create your own to learn and earn.</p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
              <Plus size={18} /> Create Lab
            </button>
          </header>

          <div className="active-labs-list">
            <h2 className="h3 mb-4">Active Labs</h2>
            {labs.map(lab => (
              <div key={lab.id} className={`lab-item ${lab.hostId === 'me' ? 'active' : ''}`} onClick={() => setActiveLab(lab)}>
                <BookOpen size={24} className={lab.hostId === 'me' ? 'text-primary' : 'text-muted'} />
                <div>
                  <div className="flex-align" style={{ gap: '0.5rem' }}>
                    <h4 className="m-0">{lab.title}</h4>
                    {lab.hostId === 'me' && <span className="badge badge-teach">Host</span>}
                  </div>
                  <p className="text-muted text-sm mt-1">{lab.topic} • {lab.members} members • {lab.difficulty}</p>
                </div>
                <div className="ml-auto">
                  <button className="btn btn-secondary btn-sm">Enter</button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        // --- WORKSPACE VIEW ---
        <div className="workspace-area animate-fade-in">
          <div className="workspace-header">
            <div>
              <button className="btn btn-outline btn-sm mb-4" onClick={() => { setActiveLab(null); setCurrentMode('menu'); }}>
                <ArrowLeft size={16} /> Back to Labs
              </button>
              <h2 className="h1 m-0">{activeLab.title}</h2>
              <div className="flex-align mt-2 text-muted text-sm" style={{ gap: '1rem' }}>
                <span className="flex-align"><BookOpen size={14} className="mr-1"/> {activeLab.topic}</span>
                <span className="flex-align"><Users size={14} className="mr-1"/> {activeLab.members} Members</span>
                <span className="badge badge-learn">{activeLab.difficulty}</span>
              </div>
            </div>
          </div>

          <div className="labs-grid split">
            {/* Sidebar Stats */}
            <div className="workspace-sidebar">
              {/* Gamification Level */}
              <div className="level-container card glass mb-4">
                <div className="level-header">
                  <h3 className="m-0 h3">Lab Level</h3>
                  <span className="level-badge">
                    <Star size={16} /> {getLevelInfo(getLabStat(activeLab.id).creditsEarned).name}
                  </span>
                </div>
                
                <div className="level-progress-wrap">
                  <div 
                    className="level-progress-fill" 
                    style={{ width: `${getLevelInfo(getLabStat(activeLab.id).creditsEarned).progress}%` }} 
                  ></div>
                </div>
                <div className="level-hint">
                  {getLevelInfo(getLabStat(activeLab.id).creditsEarned).max === 'MAX' 
                    ? 'Max Level Reached!' 
                    : `${getLabStat(activeLab.id).creditsEarned} / ${getLevelInfo(getLabStat(activeLab.id).creditsEarned).max} Credits to next level`}
                </div>
              </div>

              {/* Progress Stats */}
              <div className="card">
                <h3 className="h3 mb-4">Your Progress</h3>
                <div className="progression-board">
                  <div className="stat-box">
                    <div className="stat-value">{getLabStat(activeLab.id).attempts}</div>
                    <div className="stat-label">Attempts</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-value">{getLabStat(activeLab.id).bestScore}/5</div>
                    <div className="stat-label">Best Score</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-value text-gradient-accent">{getLabStat(activeLab.id).creditsEarned}</div>
                    <div className="stat-label">Total Earned</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Action Area */}
            <div className="workspace-main card glass">
              {currentMode === 'menu' && (
                <div className="empty-state animate-fade-in">
                  <Zap size={48} className="text-gradient mb-4" />
                  <h3 className="h2 target-actions">Ready to Learn or Earn?</h3>
                  <p className="text-muted mb-4 max-w-md">Take quizzes to test your knowledge and earn credits, or host a teaching session to help others and earn bonus rewards.</p>
                  
                  <div className="workspace-actions">
                    <button className="btn btn-primary" onClick={startQuiz}>
                      <Zap size={18} /> Generate Quiz
                    </button>
                    {(activeLab.hostId === 'me' || activeLab.difficulty !== 'Beginner') && (
                      <button className="btn btn-outline" onClick={startTeachSession}>
                        <Award size={18} /> Start Teaching Session
                      </button>
                    )}
                  </div>
                </div>
              )}

              {currentMode === 'quiz' && (
                <div className="quiz-area animate-fade-in">
                  {isGenerating ? (
                    <div className="generating-state">
                      <div className="spinner mb-4"></div>
                      <h3 className="text-gradient">AI is analyzing the lab topic...</h3>
                      <p className="loading-shimmer text-muted">Generating 5 tailored questions</p>
                    </div>
                  ) : quizQuestions.length > 0 ? (
                    <div className="quiz-content animate-slide-up">
                      <div className="quiz-header">
                        <span className="question-counter badge badge-learn">Question {currentQIndex + 1} of {quizQuestions.length}</span>
                        <span className="score-display">Correct: {quizScore}</span>
                      </div>
                      <h3 className="question-text">{quizQuestions[currentQIndex].question}</h3>
                      <div className="options-list">
                        {quizQuestions[currentQIndex].options.map((opt, idx) => {
                          let statusClass = '';
                          if (selectedAnswer !== null) {
                            if (idx === quizQuestions[currentQIndex].correct) statusClass = 'correct';
                            else if (idx === selectedAnswer) statusClass = 'incorrect';
                          }

                          return (
                            <button 
                              key={idx} 
                              className={`option-btn ${statusClass} ${selectedAnswer === idx ? 'selected' : ''}`}
                              onClick={() => handleAnswerSelect(idx)}
                              disabled={selectedAnswer !== null}
                            >
                              {opt}
                              {statusClass === 'correct' && <CheckCircle size={18} className="status-icon" />}
                              {statusClass === 'incorrect' && <XCircle size={18} className="status-icon" />}
                            </button>
                          );
                        })}
                      </div>
                      {selectedAnswer !== null && (
                        <div className="mt-4 flex-align" style={{ justifyContent: 'flex-end' }}>
                          <button className="btn btn-primary animate-fade-in" onClick={nextQuestion}>
                            {currentQIndex < quizQuestions.length - 1 ? 'Next Question' : 'Finish & Submit'}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              )}

              {currentMode === 'teach' && (
                <div className="generating-state animate-fade-in">
                  {isTeaching ? (
                    <>
                      <div className="spinner mb-4"></div>
                      <h3 className="text-gradient-accent">Teaching Session in Progress...</h3>
                      <p className="text-muted">Simulating interactive learning with peers</p>
                    </>
                  ) : null}
                </div>
              )}

              {/* Feedback Overlay inside main area */}
              {feedback && (
                <div className={`action-feedback animate-slide-up ${feedback.type === 'success' ? 'feedback-success' : 'feedback-credit'}`}>
                  {feedback.type === 'credit' && <Award size={20} />}
                  {feedback.type === 'success' && <CheckCircle size={20} />}
                  {feedback.text}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Creation Modal Overlay */}
      {showCreateModal && (
        <div className="modal-overlay animate-fade-in" onClick={(e) => {
          if (e.target.classList.contains('modal-overlay')) setShowCreateModal(false);
        }}>
          <div className="modal-content card glass animate-slide-up">
            <div className="modal-header">
              <h2 className="h2 m-0">Create Your Own Lab</h2>
              <button className="btn btn-secondary btn-sm" style={{ padding: '0.5rem', borderRadius: '50%' }} onClick={() => setShowCreateModal(false)}>
                <XCircle size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateLab}>
              <div className="form-group">
                <label className="form-label">Lab Name</label>
                <input 
                  type="text" 
                  className="input-base" 
                  placeholder="e.g., Advanced React Patterns" 
                  value={newLab.title}
                  onChange={(e) => setNewLab({...newLab, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Topic / Subject</label>
                <input 
                  type="text" 
                  className="input-base" 
                  placeholder="e.g., Computer Science" 
                  value={newLab.topic}
                  onChange={(e) => setNewLab({...newLab, topic: e.target.value})}
                  required
                />
              </div>
              <div className="form-group mb-4">
                <label className="form-label">Difficulty Level</label>
                <select 
                  className="input-base" 
                  value={newLab.difficulty}
                  onChange={(e) => setNewLab({...newLab, difficulty: e.target.value})}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
              
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <Plus size={18} /> Create Lab
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeerLabs;
