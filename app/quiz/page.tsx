// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

'use client'

import { useState, useEffect } from 'react';
import Head from 'next/head';
import CandlestickChart from '../../components/CandlestickChart';
import IndicatorSelector from '../../components/IndicatorSelector';
import TradingDecision from '../../components/TradingDecision';
import FeedbackDisplay from '../../components/FeedbackDisplay';
import { getRandomScenario } from '../../utils/quizGenerator';
import Link from 'next/link';
import { ArrowLeft } from 'react-feather';

export default function Quiz() {
  const [loading, setLoading] = useState(true);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [selectedIndicators, setSelectedIndicators] = useState([]);
  const [userDecision, setUserDecision] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  useEffect(() => {
    loadNewScenario();
  }, []);

  const loadNewScenario = async () => {
    setLoading(true);
    setUserDecision(null);
    setShowResult(false);
    
    try {
      const scenario = await getRandomScenario();
      setCurrentScenario(scenario);
    } catch (error) {
      console.error("Error loading scenario:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleIndicatorToggle = (indicator) => {
    if (selectedIndicators.includes(indicator)) {
      setSelectedIndicators(selectedIndicators.filter(i => i !== indicator));
    } else {
      setSelectedIndicators([...selectedIndicators, indicator]);
    }
  };

  const handleDecision = (decision) => {
    setUserDecision(decision);
    setShowResult(true);
    
    // Determine if decision was correct
    const isCorrect = decision === currentScenario.correctDecision;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setQuestionsAnswered(prev => prev + 1);
  };

  const handleNextQuestion = () => {
    loadNewScenario();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-2xl text-gray-600">Loading scenario...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Head>
        <title>Trading Quiz</title>
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="mr-4">
              <button className="flex items-center text-blue-400 hover:text-blue-300 transition-colors">
                <ArrowLeft size={20} className="mr-1" />
                <span>Back to Games</span>
              </button>
            </Link>
            
            <h1 className="text-2xl font-bold text-blue-400">
              Trading Quiz: {currentScenario?.symbol}
            </h1>
          </div>
          
          <div className="bg-gray-800 px-4 py-2 rounded-lg text-lg font-medium">
            Score: <span className="text-blue-400">{score}</span>/{questionsAnswered}
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-6 border border-gray-700">
          {currentScenario && (
            <div className="mb-4">
              <p className="text-lg mb-2">
                <span className="font-semibold text-blue-300">Scenario:</span> {currentScenario.description}
              </p>
              <p className="text-md text-gray-400">
                <span className="font-semibold">Date:</span> {currentScenario.date}
              </p>
            </div>
          )}
          
          <div className="h-96 mb-6 bg-gray-900 p-2 rounded-lg">
            {currentScenario && (
              <CandlestickChart 
                data={currentScenario.data} 
                indicators={selectedIndicators}
                showFuture={showResult}
              />
            )}
          </div>
          
          <IndicatorSelector 
            selectedIndicators={selectedIndicators}
            onToggle={handleIndicatorToggle}
          />
        </div>
        
        {!showResult ? (
          <TradingDecision onDecision={handleDecision} />
        ) : (
          <FeedbackDisplay 
            decision={userDecision}
            correctDecision={currentScenario.correctDecision}
            explanation={currentScenario.explanation}
            onNext={handleNextQuestion}
          />
        )}
      </main>
    </div>
  );
}