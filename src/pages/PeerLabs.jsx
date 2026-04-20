import React, { useState } from 'react';
import { Beaker, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import './PeerLabs.css';

const PeerLabs = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);

  const startQuizGeneration = () => {
    setIsGenerating(true);
    setQuiz(null);
    
    // Simulate generation via AI
    setTimeout(() => {
      setIsGenerating(false);
      setQuiz({
        topic: 'Python Basics',
        question: 'What is the correct syntax to output "Hello World" in Python?',
        options: [
          'echo "Hello World"',
          'p("Hello World")',
          'print("Hello World")',
          'console.log("Hello World")'
        ],
        correct: 2
      });
      setSelectedAnswer(null);
    }, 2000);
  };

  const handleAnswerSelect = (index) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    if (index === quiz.correct) {
      setScore(s => s + 10);
    }
  };

  return (
    <div className="peer-labs animate-fade-in">
      <header className="mb-4">
        <h1 className="h1 flex-align"><Beaker className="text-gradient" /> Peer Labs</h1>
        <p className="text-muted">Test your knowledge with community-generated mini-quizzes.</p>
      </header>

      <div className="labs-grid">
        <div className="rooms-list card">
          <h2 className="h3 mb-4">Active Labs</h2>
          <div className="lab-item active">
            <BookOpen size={18} />
            <div>
              <h4>Python Basics</h4>
              <p className="text-muted text-sm">45 members active</p>
            </div>
            <button className="btn btn-primary btn-sm ml-auto" onClick={startQuizGeneration} disabled={isGenerating}>
              {isGenerating ? 'Generating...' : 'Generate Quiz'}
            </button>
          </div>
          <div className="lab-item">
            <BookOpen size={18} />
            <div>
              <h4>Organic Chemistry 101</h4>
              <p className="text-muted text-sm">12 members active</p>
            </div>
            <button className="btn btn-secondary btn-sm ml-auto">Join</button>
          </div>
        </div>

        <div className="quiz-area card glass">
          {isGenerating ? (
            <div className="generating-state">
              <div className="spinner mb-4"></div>
              <p className="loading-shimmer text-gradient">AI is crafting a question for you...</p>
            </div>
          ) : quiz ? (
            <div className="quiz-content animate-fade-in">
              <div className="quiz-header">
                <span className="badge badge-learn">{quiz.topic}</span>
                <span className="score-display">Score: {score}</span>
              </div>
              <h3 className="question-text">{quiz.question}</h3>
              <div className="options-list">
                {quiz.options.map((opt, idx) => {
                  let statusClass = '';
                  if (selectedAnswer !== null) {
                    if (idx === quiz.correct) statusClass = 'correct';
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
                      {statusClass === 'correct' && <CheckCircle size={16} className="status-icon" color="lightgreen" />}
                      {statusClass === 'incorrect' && <XCircle size={16} className="status-icon" color="lightcoral" />}
                    </button>
                  );
                })}
              </div>
              {selectedAnswer !== null && (
                <button className="btn btn-outline mt-4" onClick={startQuizGeneration}>Next Question</button>
              )}
            </div>
          ) : (
            <div className="empty-state">
              <Beaker size={48} className="text-muted opacity-50 mb-4" />
              <p>Select a lab and generate a quiz to start learning.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeerLabs;
