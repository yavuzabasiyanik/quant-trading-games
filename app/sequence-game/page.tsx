// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

'use client'

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Star, Clock, ChevronRight, Award } from 'react-feather';
import { generateSequenceQuestion } from '../../utils/sequenceGenerator';

export default function SequenceGame() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [difficulty, setDifficulty] = useState('all');
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [inputAnswer, setInputAnswer] = useState('');
  const [inputMode, setInputMode] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  // Generate a new question
  const getNextQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setInputAnswer('');
    
    const newQuestion = generateSequenceQuestion(difficulty);
    setCurrentQuestion(newQuestion);
    setQuestionCount(prevCount => prevCount + 1);
  };

  // Start the game
  const startGame = () => {
    setScore(0);
    setTimeLeft(120);
    setQuestionCount(0);
    setCorrectCount(0);
    setWrongCount(0);
    setGameActive(true);
    setGameComplete(false);
    setShowExplanation(false);
    getNextQuestion();
  };

  // End the game
  const endGame = () => {
    clearInterval(timerRef.current);
    setGameActive(false);
    setGameComplete(true);
    
    // Update high score if current score is higher
    if (score > highScore) {
      setHighScore(score);
      // Could store in localStorage for persistence
      localStorage.setItem('sequenceGameHighScore', score.toString());
    }
  };

  // Handle answer selection (multiple choice mode)
  const handleAnswer = (answer) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections
    
    setSelectedAnswer(answer);
    
    // Update score
    if (answer === currentQuestion.correctAnswer) {
      setScore(prevScore => prevScore + 10);
      setCorrectCount(prev => prev + 1);
    } else {
      setWrongCount(prev => prev + 1);
    }
    
    setShowExplanation(true);
  };

  // Handle manual input submission
  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (selectedAnswer !== null) return; // Prevent multiple submissions
    
    const userAnswer = parseFloat(inputAnswer);
    
    if (!isNaN(userAnswer)) {
      setSelectedAnswer(userAnswer);
      
      // Update score
      if (userAnswer === currentQuestion.correctAnswer) {
        setScore(prevScore => prevScore + 15); // More points for manual input
        setCorrectCount(prev => prev + 1);
      } else {
        setWrongCount(prev => prev + 1);
      }
      
      setShowExplanation(true);
    }
  };

  // Handle moving to next question
  const handleNextQuestion = () => {
    getNextQuestion();
  };

  // Toggle input mode
  const toggleInputMode = () => {
    setInputMode(!inputMode);
  };

  // Change difficulty
  const changeDifficulty = (newDifficulty) => {
    setDifficulty(newDifficulty);
  };

  // Initialize timer when game starts
  useEffect(() => {
    if (gameActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            endGame();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameActive]);

  // Load high score from localStorage on component mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem('sequenceGameHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Focus input when input mode is active and question changes
  useEffect(() => {
    if (inputMode && inputRef.current && gameActive) {
      inputRef.current.focus();
    }
  }, [currentQuestion, inputMode, gameActive]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#131722] text-gray-100">
      <Head>
        <title>Sequence Pattern Game</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Header with back button */}
        {!gameActive && !gameComplete && (
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300">
              <ArrowLeft size={20} className="mr-2" />
              Back to Games
            </Link>
          </div>
        )}

        {/* Game UI */}
        <div className="max-w-2xl mx-auto">
          {/* Game status bar */}
          {(gameActive || gameComplete) && (
            <div className="flex justify-between items-center py-4 border-b border-gray-700 mb-8">
              <div className="flex items-center">
                <Star className="text-yellow-500 mr-2" />
                <span className="text-xl">{score} points</span>
              </div>
              
              <div className="text-xl flex items-center">
                <Clock className="mr-2 text-blue-400" />
                {gameActive ? (
                  <span>{formatTime(timeLeft)}</span>
                ) : (
                  <span>Time&apos;s up!</span>
                )}
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={startGame} 
                  className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                  title="Restart Game"
                >
                  <RefreshCw size={20} />
                </button>
                
                <Link href="/">
                  <button 
                    className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                    title="Back to Home"
                  >
                    <ArrowLeft size={20} />
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* Game content */}
          {!gameActive && !gameComplete && (
            <div className="text-center py-12">
              <h1 className="text-3xl font-bold mb-6">Pattern Sequence Challenge</h1>
              
              <div className="bg-gray-800 rounded-xl p-6 mb-8 max-w-lg mx-auto">
                <h2 className="text-xl font-semibold mb-4">How to Play</h2>
                
                <p className="text-gray-300 mb-4">
                  Find the pattern in each sequence and determine the next number.
                </p>
                
                <div className="flex flex-col space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span>Difficulty:</span>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => changeDifficulty('easy')}
                        className={`px-3 py-1 rounded ${difficulty === 'easy' ? 'bg-green-600' : 'bg-gray-700'}`}
                      >
                        Easy
                      </button>
                      <button 
                        onClick={() => changeDifficulty('medium')}
                        className={`px-3 py-1 rounded ${difficulty === 'medium' ? 'bg-yellow-600' : 'bg-gray-700'}`}
                      >
                        Medium
                      </button>
                      <button 
                        onClick={() => changeDifficulty('hard')}
                        className={`px-3 py-1 rounded ${difficulty === 'hard' ? 'bg-red-600' : 'bg-gray-700'}`}
                      >
                        Hard
                      </button>
                      <button 
                        onClick={() => changeDifficulty('all')}
                        className={`px-3 py-1 rounded ${difficulty === 'all' ? 'bg-blue-600' : 'bg-gray-700'}`}
                      >
                        All
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Input Mode:</span>
                    <div className="flex items-center">
                      <button 
                        onClick={toggleInputMode}
                        className="flex items-center space-x-2 px-3 py-1 rounded bg-gray-700"
                      >
                        <span>{inputMode ? 'Manual Input' : 'Multiple Choice'}</span>
                        <div className={`w-10 h-6 bg-gray-600 rounded-full p-1 flex ${inputMode ? 'justify-end' : 'justify-start'}`}>
                          <div className="bg-blue-400 w-4 h-4 rounded-full"></div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-700 rounded p-4 text-left text-sm text-gray-300">
                  <p className="font-semibold text-gray-200 mb-2">Types of patterns:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Arithmetic sequences (adding or subtracting)</li>
                    <li>Geometric sequences (multiplying or dividing)</li>
                    <li>Powers and squares</li>
                    <li>Fibonacci-like sequences</li>
                    <li>Alternating patterns</li>
                    <li>And more!</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={startGame}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium text-lg transition-colors"
                >
                  Start Challenge
                </button>
                
                {highScore > 0 && (
                  <div className="flex items-center px-4 py-3 bg-gray-800 rounded-lg">
                    <Award className="text-yellow-400 mr-2" />
                    <span>High Score: {highScore}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {gameActive && currentQuestion && (
            <div className="text-center py-8">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-gray-400">Question {questionCount}</div>
                  <div className="text-gray-400 flex items-center">
                    <span className="text-green-500 mr-4">✓ {correctCount}</span>
                    <span className="text-red-500">✗ {wrongCount}</span>
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-xl py-10 px-8 mb-8">
                  <div className="text-5xl mb-6 font-light tracking-wide flex items-center justify-center">
                    {currentQuestion.sequence.map((number, index) => (
                      <span key={index} className="mx-2">{number}{index < currentQuestion.sequence.length - 1 ? "," : ""}</span>
                    ))}
                    <span className="text-blue-400 ml-2">?</span>
                  </div>
                  
                  <div className="text-gray-400 text-lg">
                    Find the next number in the sequence
                  </div>
                </div>
                
                {!inputMode ? (
                  // Multiple choice mode
                  <div className="grid grid-cols-2 gap-6 max-w-xl mx-auto">
                    {currentQuestion.answers.map((answer, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswer(answer)}
                        className={`text-2xl py-6 rounded-xl transition-colors ${
                          selectedAnswer === null
                            ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
                            : selectedAnswer === answer
                              ? answer === currentQuestion.correctAnswer
                                ? 'bg-green-600 text-white'
                                : 'bg-red-600 text-white'
                              : answer === currentQuestion.correctAnswer && selectedAnswer !== null
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-800 text-white'
                        }`}
                        disabled={selectedAnswer !== null}
                      >
                        {answer}
                      </button>
                    ))}
                  </div>
                ) : (
                  // Manual input mode
                  <form onSubmit={handleInputSubmit} className="max-w-md mx-auto">
                    <div className="mb-4">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputAnswer}
                        onChange={(e) => setInputAnswer(e.target.value)}
                        className={`w-full text-2xl py-4 px-6 rounded-lg bg-gray-800 
                          border ${selectedAnswer === null 
                            ? 'border-gray-600' 
                            : parseFloat(inputAnswer) === currentQuestion.correctAnswer 
                              ? 'border-green-500' 
                              : 'border-red-500'} 
                          text-center focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Enter your answer"
                        disabled={selectedAnswer !== null}
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium"
                      disabled={selectedAnswer !== null || inputAnswer === ''}
                    >
                      Submit Answer
                    </button>
                  </form>
                )}
                
                {showExplanation && (
                  <div className="mt-8 bg-gray-800 p-6 rounded-lg max-w-xl mx-auto">
                    <h3 className="text-xl font-semibold mb-3">
                      {selectedAnswer === currentQuestion.correctAnswer 
                        ? 'Correct!' 
                        : 'Incorrect!'}
                    </h3>
                    <p className="text-gray-300 mb-4">
                      The next number in the sequence is <span className="font-bold text-blue-400">{currentQuestion.correctAnswer}</span>
                    </p>
                    <div className="text-gray-400 text-left">
                      <p className="font-medium text-gray-300 mb-1">Explanation:</p>
                      <p>{currentQuestion.explanation}</p>
                    </div>
                    <button
                      onClick={handleNextQuestion}
                      className="mt-6 flex items-center mx-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                    >
                      Next Question
                      <ChevronRight size={18} className="ml-1" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {gameComplete && (
            <div className="text-center py-12">
              <h2 className="text-3xl font-bold mb-6">Challenge Complete!</h2>
              
              <div className="bg-gray-800 rounded-xl p-8 mb-8">
                <p className="text-4xl font-bold mb-6">
                  Final Score: <span className="text-blue-400">{score}</span>
                </p>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Correct</p>
                    <p className="text-2xl text-green-400">{correctCount}</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Wrong</p>
                    <p className="text-2xl text-red-400">{wrongCount}</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Accuracy</p>
                    <p className="text-2xl text-blue-400">
                      {correctCount + wrongCount > 0 
                        ? Math.round((correctCount / (correctCount + wrongCount)) * 100) 
                        : 0}%
                    </p>
                  </div>
                </div>
                
                {score > highScore && (
                  <div className="bg-yellow-900/50 text-yellow-300 p-4 rounded-lg mb-6">
                    <div className="flex items-center justify-center mb-2">
                      <Award className="mr-2" />
                      <p className="font-bold">New High Score!</p>
                    </div>
                    <p>You beat your previous record of {highScore} points.</p>
                  </div>
                )}
                
                <p className="text-gray-300">
                  {score >= 100 ? "Exceptional pattern recognition skills!" :
                   score >= 70 ? "Great work! You have a good eye for patterns." :
                   score >= 40 ? "Good effort! Keep practicing to recognize more patterns." :
                   "Keep practicing! Pattern recognition improves with time."}
                </p>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={startGame}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
                >
                  Play Again
                </button>
                
                <Link href="/">
                  <button className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors">
                    Back to Games
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )}