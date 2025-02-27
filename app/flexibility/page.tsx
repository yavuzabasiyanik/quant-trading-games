'use client'

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, RefreshCw, Star, Clock, Award, HelpCircle, ChevronRight, ChevronLeft } from 'react-feather';
import Link from 'next/link';
import Head from 'next/head';

const FlexibilityGame = () => {
  // Game state
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds game
  const [gameActive, setGameActive] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [currentCards, setCurrentCards] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [round, setRound] = useState(1);
  const [highScore, setHighScore] = useState(0);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(null);
  
  // Timer ref
  const timerRef = useRef(null);

  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
  
  // Generate a random card pair with improved randomization
  const generateCards = () => {
    const leftCardText = colors[Math.floor(Math.random() * colors.length)];
    const rightCardText = colors[Math.floor(Math.random() * colors.length)];
    
    // Controlled randomization for card color - ensure balanced distribution
    // of matching vs non-matching cases (roughly 50/50)
    let rightCardColor;
    
    // Decide whether this should be a matching pair (roughly 50% chance)
    const shouldMatch = Math.random() < 0.5;
    
    if (shouldMatch) {
      // Make it match by setting right card color to left card text
      rightCardColor = leftCardText;
    } else {
      // Make it not match by picking any color except the left card text
      const availableColors = colors.filter(color => color !== leftCardText);
      rightCardColor = availableColors[Math.floor(Math.random() * availableColors.length)];
    }
    
    return {
      leftCard: { text: leftCardText },
      rightCard: { text: rightCardText, color: rightCardColor },
      isMatch: leftCardText === rightCardColor
    };
  };

  // Start the game
  const startGame = () => {
    setGameActive(true);
    setGameComplete(false);
    setScore(0);
    setRound(1);
    setTimeLeft(60);
    setCorrectCount(0);
    setWrongCount(0);
    setLastAnswerCorrect(null);
    setCurrentCards(generateCards());
  };

  // End the game
  const endGame = () => {
    clearInterval(timerRef.current);
    setGameActive(false);
    setGameComplete(true);
    
    // Update high score if current score is higher
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('flexibilityGameHighScore', score.toString());
    }
  };

  // Handle answer
  const handleAnswer = (userAnsweredMatch) => {
    // Check if answer is correct
    const isCorrect = userAnsweredMatch === currentCards.isMatch;
    setLastAnswerCorrect(isCorrect);
    
    // Update score and counts
    if (isCorrect) {
      setScore(prev => prev + 1);
      setCorrectCount(prev => prev + 1);
    } else {
      setScore(prev => prev - 1);
      setWrongCount(prev => prev + 1);
    }
    
    // Move to next round after short delay
    setTimeout(() => {
      setRound(prev => prev + 1);
      setCurrentCards(generateCards());
      setLastAnswerCorrect(null);
    }, 500);
  };

  // Toggle instructions
  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
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
    const savedHighScore = localStorage.getItem('flexibilityGameHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Color mapping to Tailwind classes
  const getColorClass = (color) => {
    const colorMap = {
      red: 'text-red-500',
      blue: 'text-blue-500',
      green: 'text-green-500',
      yellow: 'text-yellow-500',
      purple: 'text-purple-500',
      orange: 'text-orange-500'
    };
    
    return colorMap[color] || 'text-white';
  };

  // Calculate accuracy percentage
  const calculateAccuracy = () => {
    if (correctCount + wrongCount === 0) return 0;
    return Math.round((correctCount / (correctCount + wrongCount)) * 100);
  };

  return (
    <div className="min-h-screen bg-[#131722] text-gray-100">
      <Head>
        <title>Flexibility Challenge</title>
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

          {/* Intro screen */}
          {!gameActive && !gameComplete && (
            <div className="text-center py-10">
              <h1 className="text-3xl font-bold mb-6">Flexibility Challenge</h1>
              
              <div className="bg-gray-800 rounded-xl p-6 mb-8 max-w-lg mx-auto shadow-lg border border-gray-700/50">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">How to Play</h2>
                  <button 
                    onClick={toggleInstructions}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    {showInstructions ? 'Hide Details' : 'Show Details'}
                  </button>
                </div>
                
                <ul className="mb-4 space-y-2 text-gray-300 text-left">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>You will see two cards. Your goal is to determine whether the meaning of the card on the left corresponds to the color of the text in the card on the right.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>If they match, press the right arrow. If they don't match, press the left arrow.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>+1 point for correct answers, -1 for wrong ones</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>You have 60 seconds to score as many points as possible.</span>
                  </li>
                </ul>
                
                {showInstructions && (
                  <div className="text-gray-400 text-sm mt-4 border-t border-gray-700 pt-4 text-left">
                    <p className="mb-2">This game tests your mental flexibility and ability to manage conflicting information:</p>
                    <ul className="space-y-1 ml-4">
                      <li>• You must focus on the meaning of the left card text</li>
                      <li>• You must identify the color (not the text) of the right card</li>
                      <li>• Then determine if they match or not</li>
                      <li>• The text on the right card is meant to distract you</li>
                    </ul>
                    <p className="mt-3">
                      Traders need to quickly process information and sometimes ignore distractions. 
                      This game simulates the mental flexibility needed in fast-paced trading environments.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={startGame}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium text-lg transition-colors shadow-md"
                >
                  Start Challenge
                </button>
                
                {highScore > 0 && (
                  <div className="flex items-center px-4 py-3 bg-gray-800 rounded-lg border border-gray-700/50 shadow-md">
                    <Award className="text-yellow-400 mr-2" />
                    <span>High Score: {highScore}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Active game screen */}
          {gameActive && currentCards && (
            <div className="text-center py-8">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-gray-400">Round {round}</div>
                  <div className="text-gray-400 flex items-center">
                    <span className="text-green-500 mr-4">✓ {correctCount}</span>
                    <span className="text-red-500">✗ {wrongCount}</span>
                  </div>
                </div>
                
                {lastAnswerCorrect !== null && (
                  <div className={`text-center p-2 mb-4 text-lg font-medium rounded-lg ${
                    lastAnswerCorrect ? 'bg-green-600/30 text-green-400' : 'bg-red-600/30 text-red-400'
                  }`}>
                    {lastAnswerCorrect ? 'Correct!' : 'Incorrect!'}
                  </div>
                )}
                
                <div className="bg-gray-800 rounded-xl p-8 mb-6 shadow-lg border border-gray-700/50">
                  <div className="flex justify-center items-center space-x-12">
                    {/* Left Card */}
                    <div className="w-40 h-40 bg-gray-900 rounded-xl flex flex-col items-center justify-center shadow-lg border border-gray-700/50">
                      <p className="text-3xl font-bold text-white mb-2">
                        {currentCards?.leftCard.text}
                      </p>
                      <p className="text-gray-400 text-sm">Meaning</p>
                    </div>
                    
                    {/* Right Card */}
                    <div className="w-40 h-40 bg-gray-900 rounded-xl flex flex-col items-center justify-center shadow-lg border border-gray-700/50">
                      <p className={`text-3xl font-bold ${getColorClass(currentCards?.rightCard.color)} mb-2`}>
                        {currentCards?.rightCard.text}
                      </p>
                      <p className="text-gray-400 text-sm">Color</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-gray-800 rounded-lg text-gray-300 border border-gray-700/50 shadow-md mb-8">
                  <p className="text-sm">
                    Does the <span className="font-bold">meaning</span> of the left card
                    match the <span className="font-bold">color</span> of the text on the right card?
                  </p>
                </div>
                
                <div className="flex justify-center gap-6">
                  <button
                    onClick={() => handleAnswer(false)}
                    disabled={lastAnswerCorrect !== null}
                    className={`px-6 py-3 rounded-lg font-medium flex items-center transition-colors shadow-md ${
                      lastAnswerCorrect !== null 
                        ? 'bg-gray-700 cursor-not-allowed' 
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    <ChevronLeft size={20} className="mr-2" />
                    Not Equal
                  </button>
                  
                  <button
                    onClick={() => handleAnswer(true)}
                    disabled={lastAnswerCorrect !== null}
                    className={`px-6 py-3 rounded-lg font-medium flex items-center transition-colors shadow-md ${
                      lastAnswerCorrect !== null 
                        ? 'bg-gray-700 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    Equal
                    <ChevronRight size={20} className="ml-2" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Game complete summary */}
          {gameComplete && (
            <div className="text-center py-12">
              <h2 className="text-3xl font-bold mb-6">Challenge Complete!</h2>
              
              <div className="bg-gray-800 rounded-xl p-8 mb-8 shadow-lg border border-gray-700/50">
                <p className="text-4xl font-bold mb-6">
                  Final Score: <span className={score >= 0 ? "text-green-400" : "text-red-400"}>{score}</span>
                </p>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-700 rounded-lg p-4 shadow-md">
                    <p className="text-gray-400 text-sm mb-1">Correct</p>
                    <p className="text-2xl text-green-400">{correctCount}</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 shadow-md">
                    <p className="text-gray-400 text-sm mb-1">Wrong</p>
                    <p className="text-2xl text-red-400">{wrongCount}</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 shadow-md">
                    <p className="text-gray-400 text-sm mb-1">Accuracy</p>
                    <p className="text-2xl text-blue-400">{calculateAccuracy()}%</p>
                  </div>
                </div>
                
                {score > highScore && highScore > 0 && (
                  <div className="bg-yellow-900/50 text-yellow-300 p-4 rounded-lg mb-6 border border-yellow-600/30">
                    <div className="flex items-center justify-center mb-2">
                      <Award className="mr-2" />
                      <p className="font-bold">New High Score!</p>
                    </div>
                    <p>You beat your previous record of {highScore} points.</p>
                  </div>
                )}
                
                <p className="text-gray-300">
                  {score >= 20 ? "Excellent job! Your cognitive flexibility is outstanding." :
                   score >= 10 ? "Great work! You have good cognitive flexibility." :
                   score >= 0 ? "Good effort! Keep practicing to improve your flexibility." :
                   "Keep practicing! Cognitive flexibility improves with time."}
                </p>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={startGame}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors shadow-md"
                >
                  Play Again
                </button>
                
                <Link href="/">
                  <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors shadow-md">
                    Back to Games
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlexibilityGame;