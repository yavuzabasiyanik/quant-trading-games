/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Play, ChevronLeft, ChevronRight, Clock } from 'react-feather';

export default function Home() {
  // State for featured games carousel
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  // New state for SVG lines
  const [svgLines, setSvgLines] = useState([]);

  // Featured games data - will be shown in the carousel
  const featuredGames = [
    {
      name: "Flexibility Challenge",
      description: "Test your cognitive flexibility by matching meanings with colors. A crucial skill for traders.",
      path: "/flexibility",
      image: "/images/flexibility-game.png", // You'll need to add these images
      color: "from-blue-600 to-purple-600",
      icon: "🧠",
      isNew: true,
    },
    {
      name: "Optiver 80 in 8",
      description: "Solve 80 arithmetic problems in 8 minutes. Sharpen your mental math skills for trading.",
      path: "/optiver",
      image: "/images/optiver-game.png",
      color: "from-yellow-500 to-red-500",
      icon: "🔢",
      isNew: false,
    },
    {
      name: "Risk Balloon Challenge",
      description: "Test your risk assessment skills. How far will you push before collecting your points?",
      path: "/risk",
      image: "/images/risk-game.png",
      color: "from-green-500 to-blue-500",
      icon: "🎈",
      isNew: false,
    },
    {
      name: "Pattern Sequence",
      description: "Find patterns in number sequences. Essential for predicting market trends.",
      path: "/sequence",
      image: "/images/sequence-game.png",
      color: "from-purple-500 to-pink-500",
      icon: "📊",
      isNew: false,
    }
  ];

  // Generate SVG background lines on client-side only
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lines: any = Array.from({ length: 8 }).map((_, i) => {
      const startY = 150 + Math.random() * 300;
      const points = Array.from({ length: 12 }).map((_, j) => {
        const x = (j / 11) * 100;
        const yVariance = Math.sin(j * (i + 1) * 0.5) * 20 + Math.random() * 30;
        return `${x},${startY + yVariance}`;
      }).join(' ');
      
      return {
        points,
        stroke: i % 2 === 0 ? "#4F46E5" : "#10B981"
      };
    });
    
    setSvgLines(lines);
  }, []);

  // Implement auto-advancing carousel
  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;
    if (!isHovering) {
      interval = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % featuredGames.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isHovering, featuredGames.length]);

  // Navigation for carousel
  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % featuredGames.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + featuredGames.length) % featuredGames.length);
  };

  // Get a random game for "Quick Play"
  // Using useEffect and state to make this deterministic during initial render
  const [randomGame, setRandomGame] = useState({ name: "Trading Quiz", path: "/quiz" });
  
  useEffect(() => {
    const activeGames = [
      { name: "Trading Quiz", path: "/quiz" },
      { name: "Flexibility Challenge", path: "/flexibility" },
      { name: "Optiver 80 in 8", path: "/optiver" },
      { name: "Risk Balloon", path: "/risk" },
      { name: "Pattern Sequence", path: "/sequence" }
    ];
    setRandomGame(activeGames[Math.floor(Math.random() * activeGames.length)]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 relative">
      {/* Dynamic background with subtle chart lines - Now client-side rendered */}
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        <svg width="100%" height="100%" className="absolute inset-0" preserveAspectRatio="none">
          {svgLines.map((line: any, i) => (
            <polyline 
              key={i}
              points={line.points}
              fill="none"
              stroke={line.stroke}
              strokeWidth="2"
              className="opacity-30"
            />
          ))}
        </svg>
      </div>

      <Head>
        <title>Trading Games Platform</title>
        <meta name="description" content="Interactive trading games to improve your skills" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        {/* Featured Games Carousel */}
        <div className="max-w-5xl mx-auto mb-16"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <h2 className="text-2xl font-medium text-blue-400 mb-4">Featured Games</h2>
          
          <div className="relative h-64 rounded-xl overflow-hidden shadow-2xl bg-gray-800 border border-gray-700">
            {/* Carousel slides */}
            <div className="absolute inset-0">
              {featuredGames.map((game, index) => (
                <div 
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === activeSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${game.color} opacity-20`}></div>
                  
                  {/* Game content - repositioned with more padding */}
                  <div className="absolute inset-0 px-16 py-8 flex items-center">
                    <div className="w-3/5">
                      <div className="flex items-center">
                        <span className="text-4xl mr-3">{game.icon}</span>
                        <h3 className="text-2xl font-bold text-white mb-2">{game.name}</h3>
                        {game.isNew && (
                          <span className="ml-3 px-2 py-1 text-xs font-medium bg-blue-600 text-white rounded-md">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 mb-6 max-w-lg">{game.description}</p>
                      <Link href={game.path}>
                        <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center">
                          <Play size={16} className="mr-2" />
                          Play Now
                        </button>
                      </Link>
                    </div>
                    <div className="w-2/5 h-full flex items-center justify-center">
                      {/* This would be an actual image in a real implementation */}
                      <div className="w-56 h-40 bg-gray-700 rounded-lg border border-gray-600 flex items-center justify-center">
                        <span className="text-6xl">{game.icon}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Carousel controls - repositioned for better layout */}
            <button 
              onClick={prevSlide}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gray-900/70 hover:bg-gray-900/90 rounded-r-lg flex items-center justify-center transition-colors z-10 ml-0"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gray-900/70 hover:bg-gray-900/90 rounded-l-lg flex items-center justify-center transition-colors z-10 mr-0"
            >
              <ChevronRight size={24} />
            </button>
            
            {/* Carousel indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {featuredGames.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    index === activeSlide 
                      ? 'bg-blue-500 w-6' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Quick Play Button */}
        <div className="max-w-4xl mx-auto mb-12 flex justify-center">
          <Link href={randomGame.path}>
            <button className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 rounded-lg text-xl font-medium text-white flex items-center transition-all duration-200 transform hover:scale-105 shadow-lg">
              <Play size={24} className="mr-3 group-hover:animate-pulse" />
              Quick Play: Random Game
              <span className="ml-3 text-blue-200 text-sm group-hover:ml-4 transition-all">
                {randomGame.name}
              </span>
            </button>
          </Link>
        </div>
        
        {/* Main Game Selection */}
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-medium text-gray-100 mb-10">
            All Games
          </h1>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Trading Quiz Game */}
            <Link href="/quiz">
              <div className="bg-gray-800/50 hover:bg-gray-800 p-6 rounded-lg cursor-pointer transition-all duration-200 border border-gray-700/50 hover:border-gray-700 text-center shadow-md transform hover:-translate-y-1">
                <div className="flex justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="text-gray-300 font-medium">Trading Quiz</div>
                <div className="mt-2 flex items-center justify-center text-xs text-gray-500">
                  <Clock size={12} className="mr-1" />
                  <span>5 min</span>
                </div>
              </div>
            </Link>

            {/* Flexibility Game - Now active */}
            <Link href="/flexibility">
              <div className="bg-gray-800/50 hover:bg-gray-800 p-6 rounded-lg cursor-pointer transition-all duration-200 border border-blue-700/40 hover:border-blue-700 text-center shadow-md relative overflow-hidden transform hover:-translate-y-1">
                {/* New label */}
                <div className="absolute -right-10 top-3 bg-blue-600 text-white text-xs font-semibold px-12 py-1 transform rotate-45">
                  NEW
                </div>
                <div className="flex justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <div className="text-gray-300 font-medium">Flexibility Game</div>
                <div className="mt-2 flex items-center justify-center text-xs text-gray-500">
                  <Clock size={12} className="mr-1" />
                  <span>1 min</span>
                </div>
              </div>
            </Link>

            {/* Other games converted to the same pattern */}
            {/* Pattern Game */}
            <Link href="/sequence">
              <div className="bg-gray-800/50 hover:bg-gray-800 p-6 rounded-lg cursor-pointer transition-all duration-200 border border-gray-700/50 hover:border-gray-700 text-center shadow-md transform hover:-translate-y-1">
                <div className="flex justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-gray-300 font-medium">Pattern Game</div>
                <div className="mt-2 flex items-center justify-center text-xs text-gray-500">
                  <Clock size={12} className="mr-1" />
                  <span>2 min</span>
                </div>
              </div>
            </Link>

            {/* Sequence Game */}
            <Link href="/sequence">
              <div className="bg-gray-800/50 hover:bg-gray-800 p-6 rounded-lg cursor-pointer transition-all duration-200 border border-gray-700/50 hover:border-gray-700 text-center shadow-md transform hover:-translate-y-1">
                <div className="flex justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <div className="text-gray-300 font-medium">Sequence Game</div>
                <div className="mt-2 flex items-center justify-center text-xs text-gray-500">
                  <Clock size={12} className="mr-1" />
                  <span>2 min</span>
                </div>
              </div>
            </Link>

            {/* Optiver 80 in 8 */}
            <Link href="/optiver">
              <div className="bg-gray-800/50 hover:bg-gray-800 p-6 rounded-lg cursor-pointer transition-all duration-200 border border-gray-700/50 hover:border-gray-700 text-center shadow-md transform hover:-translate-y-1">
                <div className="flex justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div className="text-gray-300 font-medium">Optiver 80 in 8</div>
                <div className="mt-2 flex items-center justify-center text-xs text-gray-500">
                  <Clock size={12} className="mr-1" />
                  <span>8 min</span>
                </div>
              </div>
            </Link>

            {/* Memory Game - Coming soon */}
            <div className="bg-gray-800/50 p-6 rounded-lg cursor-not-allowed transition-all duration-200 border border-gray-700/50 text-center opacity-70 shadow-md">
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-gray-400 font-medium">Memory Game</div>
              <div className="mt-2 text-xs text-gray-500">Coming Soon</div>
            </div>

            {/* Risk Game */}
            <Link href="/risk">
              <div className="bg-gray-800/50 hover:bg-gray-800 p-6 rounded-lg cursor-pointer transition-all duration-200 border border-gray-700/50 hover:border-gray-700 text-center shadow-md transform hover:-translate-y-1">
                <div className="flex justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-gray-300 font-medium">Risk Game</div>
                <div className="mt-2 flex items-center justify-center text-xs text-gray-500">
                  <Clock size={12} className="mr-1" />
                  <span>∞</span>
                </div>
              </div>
            </Link>

            {/* Arithmetic Game - Coming soon */}
            <div className="bg-gray-800/50 p-6 rounded-lg cursor-not-allowed transition-all duration-200 border border-gray-700/50 text-center opacity-70 shadow-md">
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-gray-400 font-medium">Arithmetic Game</div>
              <div className="mt-2 text-xs text-gray-500">Coming Soon</div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          {/* Use suppressHydrationWarning for the current year which may differ between server and client */}
          <p suppressHydrationWarning>&copy; {new Date().getFullYear()} Trading Games Platform</p>
        </div>
      </footer>
    </div>
  );
}