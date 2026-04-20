import React, { useState, useEffect } from 'react';
import { MessageSquare, PenTool, Video, Send, CheckCircle, Zap, Star, CheckCircle2, ChevronRight, IndianRupee } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './Session.css';

const Session = () => {
  const { spendCredits, earnCredits, learnTags, credits } = useAppContext();
  
  // App States: 'hub', 'confirm', 'payment', 'matching', 'matched', 'active', 'completed'
  const [appState, setAppState] = useState('hub');
  
  // Match configurations
  const selectedTopic = learnTags.length > 0 ? learnTags[0] : 'General Studies';
  const [selectedMode, setSelectedMode] = useState('solve'); // 'chat', 'solve', 'deep'
  const [isUrgent, setIsUrgent] = useState(false);
  
  // adding states for matched UI
  const [matchedPeer, setMatchedPeer] = useState(null);

  // Mock Data
  const MOCK_PEERS = [
    { name: 'Arjun', skills: ['Data Structures', 'Python', 'Algorithms', 'General Studies'], rating: 4.8, success: 90, level: 'Expert' },
    { name: 'Kavya', skills: ['Organic Chemistry', 'Calculus', 'General Studies'], rating: 4.4, success: 78, level: 'Intermediate' },
    { name: 'Rohan', skills: ['Physics', 'Calculus', 'React'], rating: 4.9, success: 95, level: 'Expert' },
    { name: 'Priya', skills: ['Python', 'SQL', 'Data Science', 'General Studies'], rating: 4.3, success: 72, level: 'Intermediate' },
    { name: 'Vikram', skills: ['Organic Chemistry', 'Biology'], rating: 4.5, success: 80, level: 'Intermediate' },
    { name: 'Neha', skills: ['Java', 'Object Oriented Programming', 'General Studies'], rating: 4.7, success: 88, level: 'Expert' },
    { name: 'Aakash', skills: ['JavaScript', 'HTML', 'CSS', 'React', 'General Studies'], rating: 4.6, success: 82, level: 'Intermediate' },
    { name: 'Megha', skills: ['Calculus', 'Algebra', 'Geometry'], rating: 4.2, success: 70, level: 'Beginner' },
    { name: 'Sunil', skills: ['Data Structures', 'Algorithms', 'Java'], rating: 4.8, success: 87, level: 'Expert' }
  ];

  // Interactive session states
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');

  // Cost calculation
  const getNormalCost = () => {
    return selectedMode === 'chat' ? 10 : 20;
  };

  const getUrgentCost = () => {
    const topicLower = selectedTopic.toLowerCase();
    if (topicLower.includes('basic') || topicLower.includes('101') || topicLower.includes('general')) {
      return 50;
    } else if (topicLower.includes('calculus') || topicLower.includes('organic chemistry') || topicLower.includes('advanced')) {
      return 100;
    }
    return 75; // medium default
  };

  const costCredits = getNormalCost();
  const costMoney = getUrgentCost();

  const handleInitiateMatch = () => {
    setAppState('confirm');
  };

  const confirmAndFindPeer = () => {
    if (isUrgent) {
      setAppState('payment');
      setTimeout(() => {
        startMatchingFlow();
      }, 1500);
    } else {
      // Simulate normal credit deduction if possible
      spendCredits(costCredits); // Demo assumption: enough credits
      startMatchingFlow();
    }
  };

  const startMatchingFlow = () => {
    setAppState('matching');

    setTimeout(() => {
      // 1. Topic Match
      let topicMatches = MOCK_PEERS.filter(p => 
        p.skills.some(s => s.toLowerCase() === selectedTopic.toLowerCase() || s.toLowerCase() === 'general studies')
      );
      if (topicMatches.length === 0) topicMatches = MOCK_PEERS;

      // 2. Mode Match
      let validMatches = [];
      if (isUrgent) {
        validMatches = topicMatches.filter(p => p.rating >= 4.7 && p.success >= 85);
      } else {
        validMatches = topicMatches.filter(p => p.rating <= 4.7);
      }
      if (validMatches.length === 0) validMatches = topicMatches;

      // 3. Randomize selection
      const chosen = { ...validMatches[Math.floor(Math.random() * validMatches.length)] };

      // 4. Jitter if 1 match
      if (validMatches.length <= 1) {
        chosen.rating = Math.max(4.0, Math.min(5.0, chosen.rating + (Math.random() * 0.4 - 0.2)));
        chosen.success = Math.max(60, Math.min(100, Math.round(chosen.success + (Math.random() * 6 - 3))));
      }
      
      // format rating
      chosen.rating = Number(chosen.rating).toFixed(1);

      setMatchedPeer(chosen);
      setMessages([{ sender: chosen.name, text: `Hey! Ready to go over ${selectedTopic}?` }]);
      setAppState('matched');
    }, isUrgent ? 2000 : 3000);
  };

  const startSession = () => {
    setAppState('active');
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (inputMsg.trim()) {
      setMessages([...messages, { sender: 'You', text: inputMsg }]);
      setInputMsg('');
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: matchedPeer?.name || 'Peer', text: 'Yeah, that makes sense!' }]);
      }, 1500);
    }
  };

  const endSession = () => {
    setAppState('completed');
    earnCredits(20);
  };

  // 1. HUB VIEW
  if (appState === 'hub') {
    return (
      <div className="session-hub animate-fade-in">
        <h1 className="h1 text-center mb-4">Start a Learning Session</h1>
        <p className="text-muted text-center mb-2">Connect instantly with top peers.</p>
        
        <div className="hub-container card glass">
          <div className="config-section">
            <h3 className="text-sm text-muted uppercase">Selected Topic</h3>
            <div className="topic-pill badge-learn">
              {selectedTopic}
            </div>
          </div>

          <div className="config-section">
            <h3 className="text-sm text-muted uppercase">Session Mode</h3>
            <div className="mode-selector">
              <button 
                className={`mode-btn ${selectedMode === 'chat' ? 'active' : ''}`}
                onClick={() => setSelectedMode('chat')}
              >
                <div className="cost-tag">{credits >= 10 ? '10💎' : '10💎'}</div>
                <MessageSquare size={18} />
                <span>Quick Chat</span>
              </button>
              <button 
                className={`mode-btn ${selectedMode === 'solve' ? 'active' : ''}`}
                onClick={() => setSelectedMode('solve')}
              >
                <div className="recommend-star"><Star size={10} fill="gold" /></div>
                <div className="cost-tag">20💎</div>
                <PenTool size={18} />
                <span>Solve Mode</span>
              </button>
              <button 
                className="mode-btn locked"
                disabled
              >
                <Video size={18} />
                <span>Deep Session (Premium)</span>
              </button>
            </div>
            {!isUrgent && <p className="text-sm text-muted m-0 text-center mt-2">This session will cost {costCredits} credits.</p>}
          </div>

          <div className="config-section">
            <div className="urgency-toggle-wrapper">
              <div>
                <h3 className="text-sm text-muted uppercase mb-1">Urgency</h3>
                <p className="text-xs text-muted m-0">Faster matching with top verified peers</p>
              </div>
              <button 
                className={`urgency-toggle ${isUrgent ? 'urgent' : 'normal'}`}
                onClick={() => setIsUrgent(!isUrgent)}
              >
                {isUrgent ? <><IndianRupee size={14} /> Urgent • ₹50–₹100</> : 'Normal'}
              </button>
            </div>
          </div>

          <button className={`btn cta-pulse massive-btn ${isUrgent ? 'urgent-btn' : 'btn-primary'}`} onClick={handleInitiateMatch}>
            <Zap size={24} /> 
            {isUrgent ? 'PROCEED TO MATCH' : 'FIND HELP NOW'}
          </button>
        </div>
      </div>
    );
  }

  // 1.5 CONFIRMATION SUMMARY
  if (appState === 'confirm') {
    return (
      <div className="session-hub animate-fade-in">
        <h2 className="h2 text-center mb-4">Confirm Your Session</h2>
        <div className="hub-container card glass center-card">
            
          <div className="summary-list mb-4">
            <div className="summary-item">
              <span className="text-muted">Topic</span>
              <strong>{selectedTopic}</strong>
            </div>
            <div className="summary-item">
              <span className="text-muted">Mode</span>
              <strong>{selectedMode === 'chat' ? 'Quick Chat' : 'Solve Mode'}</strong>
            </div>
            <div className="summary-item summary-total">
              <span className="text-muted">Total Cost</span>
              {isUrgent ? (
                <strong className="text-urgent"><IndianRupee size={16} />{costMoney}</strong>
              ) : (
                <strong className="text-credits">{costCredits} Credits</strong>
              )}
            </div>
          </div>

          <button className={`btn massive-btn full-width ${isUrgent ? 'urgent-btn' : 'btn-primary'}`} onClick={confirmAndFindPeer}>
            Confirm & Find Peer
          </button>
          <button className="btn btn-outline full-width mt-2" style={{ border: 'none' }} onClick={() => setAppState('hub')}>
            Back
          </button>
        </div>
      </div>
    );
  }

  // 1.8 PAYMENT PROCESSING MOCK
  if (appState === 'payment') {
    return (
      <div className="session-hub animate-fade-in text-center">
        <div className="loading-container">
          <div className="spinner massive-spinner mb-4 spinner-urgent"></div>
          <h2 className="h2 text-urgent">Processing payment...</h2>
          <p className="text-muted">Confirming ₹{costMoney} via Secure Gateway</p>
        </div>
      </div>
    );
  }

  // 2. MATCHING LOADING VIEW
  if (appState === 'matching') {
    return (
      <div className="session-hub animate-fade-in text-center">
        <div className="loading-container">
          <div className={`spinner massive-spinner mb-4 ${isUrgent ? 'spinner-urgent' : ''}`}></div>
          <h2 className="h2 text-gradient">Finding the best peer for you...</h2>
          <p className="text-muted">Analyzing availability for {selectedTopic}</p>
        </div>
      </div>
    );
  }

  // 3. MATCH RESULT VIEW
  if (appState === 'matched' && matchedPeer) {
    return (
      <div className="session-hub animate-fade-in">
        <h2 className="h2 text-center text-gradient mb-4">Match Found! 🎉</h2>
        <div className="match-result-card card glass center-card">
          <div className="match-profile-large">
            <div className="avatar-large">👨🏽‍🎓</div>
            <h3 className="h2 mt-2">{matchedPeer.name}</h3>
            
            <div className="match-tags flex-align mx-auto justify-center mb-4 mt-2" style={{gap: '0.5rem', flexWrap: 'wrap'}}>
              <span className="badge badge-learn flex-align gap-1"><CheckCircle2 size={12}/> Matched for your topic</span>
              {isUrgent && <span className="badge badge-teach flex-align gap-1"><Zap size={12} fill="currentColor"/> Top Mentor ⚡</span>}
            </div>
            
            <div className="match-stats-large mb-4">
              <div className="stat-box">
                <Star size={18} color="gold" fill="gold" />
                <span className="stat-val">{matchedPeer.rating}</span>
                <span className="stat-lbl">Rating</span>
              </div>
              <div className="stat-box">
                <CheckCircle2 size={18} color="lightgreen" />
                <span className="stat-val">{matchedPeer.success}%</span>
                <span className="stat-lbl">Success</span>
              </div>
            </div>
            
            <button className="btn btn-primary massive-btn full-width" onClick={startSession}>
              Start Session <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. ACTIVE SESSION VIEW (Same as before)
  if (appState === 'active') {
    return (
      <div className="session-container animate-fade-in">
        <header className="session-header">
          <h1 className="h2 flex-align"><div className="live-dot"></div> Live Session with {matchedPeer?.name || 'Peer'}</h1>
          <button className="btn btn-outline" onClick={endSession}>End Session & Earn</button>
        </header>

        <div className="session-tabs">
          <button 
            className={`tab-btn ${selectedMode === 'chat' ? 'active' : ''}`}
            onClick={() => setSelectedMode('chat')}
          >
            <MessageSquare size={18} /> Quick Chat
          </button>
          <button 
            className={`tab-btn ${selectedMode === 'solve' ? 'active' : ''}`}
            onClick={() => setSelectedMode('solve')}
          >
            <PenTool size={18} /> Solve Mode
          </button>
          <button 
            className={`tab-btn ${selectedMode === 'deep' ? 'active' : ''}`}
            onClick={() => setSelectedMode('deep')}
          >
            <Video size={18} /> Deep Session
          </button>
        </div>

        <div className="session-content card glass">
          {selectedMode === 'chat' && (
            <div className="chat-interface">
              <div className="chat-messages">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`message ${msg.sender === 'You' ? 'msg-self' : 'msg-peer'}`}>
                    <span className="msg-sender">{msg.sender}</span>
                    <div className="msg-bubble">{msg.text}</div>
                  </div>
                ))}
              </div>
              <form className="chat-input" onSubmit={handleSend}>
                <input 
                  type="text" 
                  className="input-base" 
                  placeholder="Type your message..." 
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                />
                <button type="submit" className="btn btn-primary btn-icon"><Send size={18} /></button>
              </form>
            </div>
          )}

          {selectedMode === 'solve' && (
            <div className="solve-mode">
              <div className="whiteboard-placeholder">
                <PenTool size={48} className="text-muted mb-4 opacity-50" />
                <h3>Interactive Whiteboard</h3>
                <p className="text-muted">Solve together here</p>
                <div className="mock-drawing"></div>
              </div>
            </div>
          )}

          {selectedMode === 'deep' && (
            <div className="deep-session">
              <div className="video-placeholder">
                <Video size={64} className="text-muted mb-4 opacity-50" />
                <h3>Video Session (Premium)</h3>
                <p className="text-muted mb-4">Upgrade to access high-quality video & audio rooms.</p>
                <button className="btn btn-secondary">Upgrade to Pyxora+</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 5. COMPLETED VIEW
  if (appState === 'completed') {
    return (
      <div className="session-completed animate-fade-in card">
        <CheckCircle size={64} className="text-gradient-accent mb-4" />
        <h1 className="h1">Session Complete!</h1>
        <p>Great job collaborating.</p>
        <div className="credit-earn-animation animate-fade-in mt-4">
          <h2>+20 Credits Earned! 💎</h2>
        </div>
      </div>
    );
  }

  return null;
};

export default Session;
