// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client'

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  RefreshCw, 
  Award, 
  AlertCircle, 
  Wind, 
  DollarSign, 
  TrendingUp,
  HelpCircle,
  BarChart2,
} from 'react-feather';
import { 
  calculatePopProbability, 
  doesBalloonPop, 
  calculateBalloonSize, 
  calculateBalloonColor,
  calculateStressLevel,
  getBalloonRecommendation,
  generateRiskProfile,
  getExpectedValue
} from '@/utils/balloonGame';

export default function RiskGame() {
  // Game state
  const [gameActive, setGameActive] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [pumpCount, setPumpCount] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [isBalloonPopped, setIsBalloonPopped] = useState(false);
  const [showHints, setShowHints] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [gameHistory, setGameHistory] = useState([]);
  const [highScore, setHighScore] = useState(0);
  const [showStats, setShowStats] = useState(false);
  
  // UI refs
  const balloonRef = useRef(null);
  const containerRef = useRef(null);
  
  // Start a new game
  const startGame = () => {
    setGameActive(true);
    setGameComplete(false);
    setCurrentRound(1);
    setPumpCount(0);
    setTotalScore(0);
    setIsBalloonPopped(false);
    setGameHistory([]);
  };

  // Reset for a new round (after collecting or popping)
  const startNewRound = () => {
    // If we've completed all 30 rounds, end the game
    if (currentRound >= 30) {
      endGame();
      return;
    }
    
    setCurrentRound(prev => prev + 1);
    setPumpCount(0);
    setIsBalloonPopped(false);
    setIsAnimating(false);
    
    // Reset balloon appearance
    if (balloonRef.current) {
      balloonRef.current.style.transform = 'scale(1)';
      balloonRef.current.style.opacity = '1';
    }
  };

  // End the game
  const endGame = () => {
    setGameActive(false);
    setGameComplete(true);
    
    // Update high score if needed
    if (totalScore > highScore) {
      setHighScore(totalScore);
      localStorage.setItem('riskGameHighScore', totalScore.toString());
    }
  };
  
  // Pump the balloon with faster response
  const pumpBalloon = () => {
    if (!gameActive || isBalloonPopped || isAnimating) return;
    
    // Much shorter animation lock to allow rapid clicking
    setIsAnimating(true);
    
    // Simple visual feedback without elaborate animations
    if (balloonRef.current) {
      balloonRef.current.style.transition = 'transform 100ms ease, width 100ms ease, height 100ms ease, background-color 100ms ease';
    }
    
    // Increment pump count immediately
    const newPumpCount = pumpCount + 1;
    setPumpCount(newPumpCount);
    
    // Check if balloon pops with minimal delay
    if (doesBalloonPop(newPumpCount)) {
      popBalloon();
    } else {
      // Release the animation lock very quickly
      setTimeout(() => {
        setIsAnimating(false);
      }, 50); // Much shorter lock time to enable rapid clicking
    }
  };
  
  // Pop the balloon with minimal animation
  const popBalloon = () => {
    if (isBalloonPopped) return;
    
    // Set state immediately
    setIsAnimating(true);
    setIsBalloonPopped(true);
    
    // Simple fade out for the balloon
    if (balloonRef.current) {
      balloonRef.current.style.transition = 'opacity 150ms ease-out';
      balloonRef.current.style.opacity = '0';
    }
    
    // Optional vibration for feedback
    if (navigator.vibrate) {
      navigator.vibrate(40);
    }
    
    // Update game history
    setGameHistory(prev => [...prev, {
      round: currentRound,
      pumps: pumpCount,
      points: 0,
      popped: true
    }]);
    
    // Quick transition to next round
    setTimeout(() => {
      setIsAnimating(false);
      startNewRound();
    }, 300); // Much faster transition
  };
  
  // Collect the balloon points quickly
  const collectPoints = () => {
    if (!gameActive || isBalloonPopped || isAnimating || pumpCount === 0) return;
    
    // Set state immediately
    setIsAnimating(true);
    
    // Simple fade out for balloon
    if (balloonRef.current) {
      balloonRef.current.style.transition = 'opacity 150ms ease-out, transform 150ms ease-out';
      balloonRef.current.style.opacity = '0';
      balloonRef.current.style.transform = 'scale(0.8)';
    }
    
    // Add points without delay
    setTotalScore(prev => prev + pumpCount);
    
    // Update game history
    setGameHistory(prev => [...prev, {
      round: currentRound,
      pumps: pumpCount,
      points: pumpCount,
      popped: false
    }]);
    
    // Quick transition to next round
    setTimeout(() => {
      startNewRound();
    }, 300); // Much faster transition
  };
  
  // Toggle help/hints display
  const toggleHints = () => {
    setShowHints(!showHints);
  };
  
  // Toggle stats display
  const toggleStats = () => {
    setShowStats(!showStats);
  };
  
  // Calculate current balloon size for display
  const balloonSize = calculateBalloonSize(pumpCount);
  
  // Get balloon color based on risk
  const balloonColor = calculateBalloonColor(pumpCount);
  
  // Get current risk level as percentage
  const riskPercentage = Math.round(calculatePopProbability(pumpCount) * 100);
  
  // Get stress animation level - we'll use this for minimal visual feedback
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const stressLevel = calculateStressLevel(pumpCount);
  
  // Get expected value for current pump count
  const expectedValue = getExpectedValue(pumpCount);
  
  // Load high score from localStorage on component mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem('riskGameHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);
  
  // Get statistics for summary
  const gameStats = generateRiskProfile(gameHistory);
  
  // Round progress percentage
  const roundProgress = (currentRound / 30) * 100;
  
  return (
    <div className="min-h-screen bg-[#131722] text-gray-100">
      <style jsx global>{`
        /* Minimal animations for essential feedback */
        .balloon {
          border-radius: 50%;
          position: relative;
          background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.2) 30%, rgba(0, 0, 0, 0.1) 80%);
          box-shadow: 
            0 10px 25px rgba(0, 0, 0, 0.3), 
            inset 0 -10px 15px rgba(0, 0, 0, 0.2), 
            inset 5px 5px 25px rgba(255, 255, 255, 0.5);
          transform-origin: center bottom;
        }
        
        .balloon::before {
          content: '';
          position: absolute;
          top: 15%;
          left: 25%;
          width: 25%;
          height: 15%;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.2));
          transform: rotate(-15deg);
          filter: blur(2px);
        }
        
        .balloon-string {
          width: 2px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(200,200,200,0.6));
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%) translateY(100%);
          height: 45px;
          border-radius: 0 0 2px 2px;
        }
        
        .balloon-knot {
          width: 12px;
          height: 12px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(200, 200, 200, 0.6));
          border-radius: 50%;
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%) translateY(0%);
        }
        
        /* Button styles with faster transitions */
        .button-hover {
          transition: all 0.15s ease-out;
        }
        
        .button-hover:hover {
          transform: translateY(-2px);
        }
        
        .button-hover:active {
          transform: translateY(-1px);
        }
        
        .pump-btn {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        }
        
        .pump-btn:hover {
          background: linear-gradient(135deg, #4f8df9, #2563eb);
        }
        
        .collect-btn {
          background: linear-gradient(135deg, #22c55e, #16a34a);
        }
        
        .collect-btn:hover {
          background: linear-gradient(135deg, #4ade80, #22c55e);
        }
      `}</style>

      <div className="container mx-auto px-4 py-8">
        {/* Header with back button */}
        {!gameActive && !gameComplete && (
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-all duration-200 hover:translate-x-[-2px]">
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
              <div className="flex items-center" data-score-display>
                <DollarSign className="text-green-500 mr-2" />
                <span className="text-xl">{totalScore} points</span>
              </div>
              
              <div className="text-xl flex items-center">
                <span className="mr-2">Round:</span>
                <span>{currentRound}/30</span>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={startGame} 
                  className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors button-hover"
                  title="Restart Game"
                >
                  <RefreshCw size={20} />
                </button>
                
                <Link href="/">
                  <button 
                    className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors button-hover"
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
            <div className="text-center py-12">
              <h1 className="text-3xl font-bold mb-6">Risk Balloon Challenge</h1>
              
              <div className="bg-gray-800 rounded-xl p-6 mb-8 max-w-lg mx-auto shadow-lg border border-gray-700/50">
                <h2 className="text-xl font-semibold mb-4">How to Play</h2>
                
                <div className="text-left text-gray-300 mb-6 space-y-3">
                  <p>
                    Test your risk assessment skills with the balloon challenge!
                  </p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>You have 30 rounds to earn as many points as possible.</li>
                    <li>Each round, you get a new balloon that starts with 1 point.</li>
                    <li>Every time you pump the balloon, you add 1 point to its value.</li>
                    <li>But beware! The balloon might pop at any time. If it pops, you lose all points for that round.</li>
                    <li>You can collect your points at any time to secure them and move to the next round.</li>
                  </ol>
                  <p className="italic mt-4">
                    How much risk are you willing to take? Will you play it safe or push your luck?
                  </p>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4 text-left">
                  <div className="flex items-center text-yellow-300 mb-2">
                    <AlertCircle size={16} className="mr-2" />
                    <span className="font-medium">Risk Assessment Strategy</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    The probability of the balloon popping increases with each pump. 
                    This game tests your ability to evaluate risk versus reward - a crucial skill in trading and investment.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={startGame}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium text-lg transition-all duration-200 button-hover"
                >
                  Start Challenge
                </button>
                
                {highScore > 0 && (
                  <div className="flex items-center px-4 py-3 bg-gray-800 rounded-lg border border-yellow-500/30">
                    <Award className="text-yellow-400 mr-2" />
                    <span>High Score: {highScore}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Active game screen */}
          {gameActive && (
            <div className="text-center py-4 relative" ref={containerRef}>
              {/* Progress bar */}
              <div className="h-2 bg-gray-700 rounded-full mb-8 overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300" 
                  style={{ width: `${roundProgress}%` }}
                ></div>
              </div>
              
              {/* Info panel */}
              <div className="flex justify-between items-center mb-4">
                <div className={`text-lg ${isBalloonPopped ? 'text-red-500' : 'text-green-500'}`}>
                  {isBalloonPopped ? 'Balloon Popped!' : `Current Balloon: ${pumpCount} points`}
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={toggleHints}
                    className={`p-2 rounded-full ${showHints ? 'bg-blue-600' : 'bg-gray-700'} transition-colors button-hover`}
                    title="Toggle Hints"
                  >
                    <HelpCircle size={18} />
                  </button>
                  <button
                    onClick={toggleStats}
                    className={`p-2 rounded-full ${showStats ? 'bg-blue-600' : 'bg-gray-700'} transition-colors button-hover`}
                    title="Toggle Stats"
                  >
                    <BarChart2 size={18} />
                  </button>
                </div>
              </div>
              
              {/* Balloon display */}
              <div className="relative h-80 flex items-center justify-center mb-6">
                <div 
                  ref={balloonRef}
                  className="balloon"
                  style={{
                    width: `${balloonSize}px`,
                    height: `${balloonSize}px`,
                    backgroundColor: balloonColor,
                    opacity: isBalloonPopped ? 0 : 1,
                    transition: 'width 150ms ease-out, height 150ms ease-out, opacity 150ms ease-out, transform 150ms ease-out, background-color 150ms ease-out'
                  }}
                >
                  {pumpCount > 0 && !isBalloonPopped && (
                    <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white drop-shadow-lg">
                      {pumpCount}
                    </div>
                  )}
                  
                  {/* Balloon knot/string */}
                  {!isBalloonPopped && (
                    <>
                      <div className="balloon-knot"></div>
                      <div className="balloon-string"></div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Risk indicators - always reserve space, but conditionally show content */}
              <div className="bg-gray-800 p-4 rounded-lg mb-6 shadow-lg border border-gray-700/50" 
                   style={{ 
                     height: showHints ? 'auto' : '0px', 
                     padding: showHints ? '16px' : '0px',
                     margin: showHints ? '0 0 24px 0' : '0',
                     opacity: showHints ? 1 : 0,
                     overflow: 'hidden',
                     transition: 'height 150ms ease-out, padding 150ms ease-out, margin 150ms ease-out, opacity 150ms ease-out'
                   }}>
                {showHints && (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <span>Pop Risk:</span>
                      <span className={`font-medium ${
                        riskPercentage < 30 ? 'text-green-400' : 
                        riskPercentage < 60 ? 'text-yellow-400' : 
                        'text-red-400'
                      }`}>{isBalloonPopped ? '100' : riskPercentage}%</span>
                    </div>
                    
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mb-3">
                      <div 
                        className="h-2.5 rounded-full transition-all duration-150"
                        style={{
                          width: isBalloonPopped ? '100%' : `${riskPercentage}%`,
                          backgroundColor: isBalloonPopped ? '#ef4444' : `${
                            riskPercentage < 30 ? '#4ade80' : 
                            riskPercentage < 60 ? '#facc15' : 
                            '#ef4444'
                          }`
                        }}
                      ></div>
                    </div>
                    
                    <div className="text-sm text-gray-400 italic">
                      {isBalloonPopped ? 'The balloon popped! Get ready for the next round.' : 
                       pumpCount === 0 ? 'Start pumping to build points.' :
                       getBalloonRecommendation(pumpCount)}
                    </div>
                  </>
                )}
              </div>
              
              {/* Stats display - always reserve space, but conditionally show content */}
              <div className="bg-gray-800 p-4 rounded-lg mb-6 shadow-lg border border-gray-700/50"
                   style={{ 
                     height: showStats ? 'auto' : '0px', 
                     padding: showStats ? '16px' : '0px',
                     margin: showStats ? '0 0 24px 0' : '0',
                     opacity: showStats ? 1 : 0,
                     overflow: 'hidden',
                     transition: 'height 150ms ease-out, padding 150ms ease-out, margin 150ms ease-out, opacity 150ms ease-out'
                   }}>
                {showStats && (
                  <div className="text-left grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-gray-400 text-sm">Expected Value</div>
                      <div className="font-medium text-blue-300">
                        {isBalloonPopped ? '0' : 
                         pumpCount === 0 ? '0' : 
                         expectedValue} points
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">Success Rate</div>
                      <div className="font-medium text-green-300">
                        {isBalloonPopped ? '0' : 
                         pumpCount === 0 ? '100' : 
                         100 - riskPercentage}%
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Action buttons */}
              <div className="flex justify-center gap-6 mt-6">
                <button
                  onClick={pumpBalloon}
                  disabled={isBalloonPopped}
                  className={`px-8 py-4 rounded-lg font-medium text-lg transition-all duration-150 flex items-center shadow-lg ${
                    isBalloonPopped 
                      ? 'bg-gray-800 text-gray-400 cursor-not-allowed' 
                      : 'pump-btn text-white button-hover'
                  }`}
                >
                  <Wind size={20} className="mr-2" />
                  Pump Balloon
                </button>
                
                <button
                  onClick={collectPoints}
                  disabled={isBalloonPopped || pumpCount === 0}
                  className={`px-8 py-4 rounded-lg font-medium text-lg transition-all duration-150 flex items-center shadow-lg ${
                    isBalloonPopped || pumpCount === 0
                      ? 'bg-gray-800 text-gray-400 cursor-not-allowed' 
                      : 'collect-btn text-white button-hover'
                  }`}
                >
                  <DollarSign size={20} className="mr-2" />
                  Collect {pumpCount} Points
                </button>
              </div>
              
              {/* Round history */}
              {gameHistory.length > 0 && (
                <div className="mt-8">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium">Round History</h3>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700/30">
                      <thead className="bg-gray-700">
                        <tr>
                          <th className="px-4 py-2 text-left">Round</th>
                          <th className="px-4 py-2 text-left">Pumps</th>
                          <th className="px-4 py-2 text-left">Result</th>
                          <th className="px-4 py-2 text-left">Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gameHistory.slice(-5).map((round, index) => (
                          <tr key={index} className="border-t border-gray-700">
                            <td className="px-4 py-2">{round.round}</td>
                            <td className="px-4 py-2">{round.pumps}</td>
                            <td className="px-4 py-2">
                              <span className={round.popped ? 'text-red-500' : 'text-green-500'}>
                                {round.popped ? 'Popped' : 'Collected'}
                              </span>
                            </td>
                            <td className="px-4 py-2">{round.points}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Game complete summary */}
          {gameComplete && (
            <div className="text-center py-12">
              <h2 className="text-3xl font-bold mb-6">Challenge Complete!</h2>
              
              <div className="bg-gray-800 rounded-xl p-8 mb-8 shadow-lg border border-gray-700/50">
                <p className="text-4xl font-bold mb-6">
                  Final Score: <span className="text-green-400">{totalScore}</span>
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-700 rounded-lg p-4 shadow-md">
                    <p className="text-gray-400 text-sm mb-1">Total Rounds</p>
                    <p className="text-2xl">{gameHistory.length}</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 shadow-md">
                    <p className="text-gray-400 text-sm mb-1">Balloons Popped</p>
                    <p className="text-2xl text-red-400">{gameStats.poppedBalloons}</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 shadow-md">
                    <p className="text-gray-400 text-sm mb-1">Avg. Pumps</p>
                    <p className="text-2xl text-blue-400">{gameStats.averagePumps.toFixed(1)}</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 shadow-md">
                    <p className="text-gray-400 text-sm mb-1">Risk Profile</p>
                    <p className="text-xl">{gameStats.riskProfile}</p>
                  </div>
                </div>
                
                {totalScore > highScore && highScore > 0 && (
                  <div className="bg-yellow-900/50 text-yellow-300 p-4 rounded-lg mb-6 border border-yellow-600/30">
                    <div className="flex items-center justify-center mb-2">
                      <Award className="mr-2" />
                      <p className="font-bold">New High Score!</p>
                    </div>
                    <p>You beat your previous record of {highScore} points.</p>
                  </div>
                )}
                
                <div className="bg-gray-700 p-4 rounded-lg text-left shadow-md">
                  <h3 className="font-medium mb-2 flex items-center">
                    <TrendingUp size={18} className="mr-2 text-blue-400" />
                    Risk Analysis
                  </h3>
                  <p className="text-gray-300 mb-3">
                    Your risk profile is <strong>{gameStats.riskProfile}</strong>. You averaged {gameStats.averagePumps.toFixed(1)} pumps per balloon and had {gameStats.poppedBalloons} balloons pop.
                  </p>
                  <p className="text-gray-300">
                    {gameStats.riskProfile === 'Very Conservative' && 'You played it extremely safe, potentially missing out on higher returns. Consider taking more calculated risks.'}
                    {gameStats.riskProfile === 'Conservative' && 'You played it safe, balancing risk and reward conservatively. With more risk tolerance, you might achieve higher returns.'}
                    {gameStats.riskProfile === 'Moderate' && 'You maintained a good balance between risk and reward, making reasonably optimal decisions.'}
                    {gameStats.riskProfile === 'Aggressive' && 'You showed high risk tolerance, pushing for higher rewards. This paid off sometimes but also led to more losses.'}
                    {gameStats.riskProfile === 'Very Aggressive' && 'You took extreme risks, pushing each balloon to its limits. While this can yield high returns, it often results in more losses.'}
                  </p>
                </div>
                
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={startGame}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-all duration-150 button-hover shadow-lg"
                >
                  Play Again
                </button>
                
                <Link href="/">
                  <button className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-all duration-150 button-hover shadow-lg">
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
}