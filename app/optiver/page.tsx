'use client'

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Star, Clock, SkipForward, Info } from 'react-feather';
import { generateQuestion } from '../../utils/optiverQuestions';

export default function OptiverGame() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(480); // 8 minutes in seconds
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const timerRef = useRef(null);

  // Generate a new question
  const getNextQuestion = () => {
    setSelectedAnswer(null);
    if (questionCount >= 80) {
      endGame();
      return;
    }
    
    const newQuestion = generateQuestion();
    setCurrentQuestion(newQuestion);
    setQuestionCount(prevCount => prevCount + 1);
  };

  // Start the game
  const startGame = () => {
    setScore(0);
    setTimeLeft(480);
    setQuestionCount(0);
    setCorrectCount(0);
    setWrongCount(0);
    setGameActive(true);
    setGameComplete(false);
    getNextQuestion();
  };

  // End the game
  const endGame = () => {
    clearInterval(timerRef.current);
    setGameActive(false);
    setGameComplete(true);
  };

  // Handle answer selection
  const handleAnswer = (answer) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections
    
    setSelectedAnswer(answer);
    
    // Update score (+1 for correct, -2 for incorrect)
    if (answer === currentQuestion.correctAnswer) {
      setScore(prevScore => prevScore + 1);
      setCorrectCount(prev => prev + 1);
    } else {
      setScore(prevScore => prevScore - 2);
      setWrongCount(prev => prev + 1);
    }
    
    // Move to next question after a short delay
    setTimeout(() => {
      getNextQuestion();
    }, 800); // Slightly longer delay to see the correct answer
  };

  // Handle skip
  const handleSkip = () => {
    getNextQuestion();
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

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle instructions
  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  // Calculate accuracy percentage
  const calculateAccuracy = () => {
    if (correctCount + wrongCount === 0) return 0;
    return Math.round((correctCount / (correctCount + wrongCount)) * 100);
  };

  return (
    <div className="min-h-screen bg-[#131722] text-gray-100">
      <Head>
        <title>Optiver 80 in 8 Challenge</title>
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
                  <span>Time's up!</span>
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
              <h1 className="text-3xl font-bold mb-6">Optiver 80 in 8 Challenge</h1>
              
              <div className="bg-gray-800 rounded-xl p-6 mb-8 max-w-lg mx-auto text-left">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">How to Play</h2>
                  <button 
                    onClick={toggleInstructions}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    {showInstructions ? 'Hide Details' : 'Show Details'}
                  </button>
                </div>
                
                <ul className="mb-4 space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Solve 80 arithmetic problems in 8 minutes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>+1 point for correct answers, -2 for wrong ones</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Skip questions without penalty</span>
                  </li>
                </ul>
                
                {showInstructions && (
                  <div className="text-gray-400 text-sm mt-4 border-t border-gray-700 pt-4">
                    <p className="mb-2">Question types include:</p>
                    <ul className="space-y-1 ml-4">
                      <li>• Addition/subtraction of 2-3 digit numbers</li>
                      <li>• Multiplication of 2-digit numbers</li>
                      <li>• Division with whole number or decimal results</li>
                      <li>• Finding percentages</li>
                      <li>• Missing number equations</li>
                      <li>• Calculations with decimals</li>
                    </ul>
                    <p className="mt-3">
                      This challenge is inspired by Optiver's trading interview test 
                      which requires 80 mental math calculations in 8 minutes.
                    </p>
                  </div>
                )}
              </div>
              
              <button
                onClick={startGame}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium text-lg transition-colors"
              >
                Start Challenge
              </button>
            </div>
          )}

          {gameActive && currentQuestion && (
            <div className="text-center py-8">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-gray-400">Question {questionCount} / 80</div>
                  <div className="text-gray-400 flex items-center">
                    <span className="text-green-500 mr-4">✓ {correctCount}</span>
                    <span className="text-red-500">✗ {wrongCount}</span>
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-xl p-8 mb-8">
                  <div className="text-5xl mb-2 font-light tracking-wide">{currentQuestion.displayQuestion}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-6 max-w-xl mx-auto">
                  {currentQuestion.answers.map((answer, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(answer)}
                      className={`text-2xl py-8 rounded-xl transition-colors ${
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
                
                <button
                  onClick={handleSkip}
                  className="mt-8 px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors flex items-center mx-auto"
                  disabled={selectedAnswer !== null}
                >
                  <SkipForward size={16} className="mr-2" />
                  Skip Question
                </button>
              </div>
            </div>
          )}

          {gameComplete && (
            <div className="text-center py-12">
              <h2 className="text-3xl font-bold mb-6">Challenge Complete!</h2>
              
              <div className="bg-gray-800 rounded-xl p-8 mb-8">
                <p className="text-4xl font-bold mb-4">
                  Your Score: <span className={score >= 0 ? "text-green-400" : "text-red-400"}>{score}</span>
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
                    <p className="text-2xl text-blue-400">{calculateAccuracy()}%</p>
                  </div>
                </div>
                
                <p className="text-gray-300">
                  {score >= 60 ? "Excellent job! You have great mental math skills." :
                   score >= 40 ? "Great work! Your mental math is strong." :
                   score >= 20 ? "Good effort! Keep practicing to improve." :
                   "Keep practicing! Mental math improves with time."}
                </p>
              </div>
              
              <button
                onClick={startGame}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors mr-4"
              >
                Try Again
              </button>
              
              <Link href="/">
                <button className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors">
                  Back to Games
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}