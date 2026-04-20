import React, { useState, useEffect } from 'react';
import { Timer as TimerIcon, Play, Square, Users } from 'lucide-react';
import './FocusRoom.css';

const FocusRoom = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const onlineCount = 124; // Mock online count

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  return (
    <div className="focus-room animate-fade-in">
      <header className="mb-4">
        <h1 className="h1 flex-align"><TimerIcon className="text-gradient-accent" /> Focus Rooms</h1>
        <p className="flex-align text-muted"><Users size={16} /> {onlineCount} students studying right now</p>
      </header>

      <div className="timer-container card glass">
        <div className="timer-circle">
          <svg className="timer-svg" viewBox="0 0 100 100">
            <circle className="timer-bg" cx="50" cy="50" r="45"></circle>
            <circle 
              className="timer-progress" 
              cx="50" cy="50" r="45"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * progress) / 100}
            ></circle>
          </svg>
          <div className="timer-display">
            <span className="time">{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
            <span className="mode">Deep Work</span>
          </div>
        </div>

        <div className="timer-controls">
          <button className={`btn ${isActive ? 'btn-secondary' : 'btn-primary'}`} onClick={toggleTimer}>
            {isActive ? <><Square size={18} /> Pause Focus</> : <><Play size={18} /> Start Focus Session</>}
          </button>
          <button className="btn btn-outline" onClick={resetTimer}>Reset</button>
        </div>
      </div>
      
      <div className="motivation-card card mt-4">
        <h3>Why Focus?</h3>
        <p className="text-sm text-muted">Complete focus sessions to unlock special badges and increase your matchmaking priority.</p>
      </div>
    </div>
  );
};

export default FocusRoom;
