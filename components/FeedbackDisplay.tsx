// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React from 'react';

const FeedbackDisplay = ({ decision, correctDecision, explanation, onNext }) => {
  const isCorrect = decision === correctDecision;
  
  const getDecisionText = (d) => {
    switch (d) {
      case 'buy': return 'Buy';
      case 'short': return 'Short';
      case 'hold': return 'Hold';
      default: return d;
    }
  };
  
  return (
    <div className={`p-6 rounded-xl shadow-lg border ${
      isCorrect ? 'bg-green-900/40 border-green-700' : 'bg-red-900/40 border-red-700'
    }`}>
      <div className="mb-6">
        <h2 className={`text-xl font-bold ${
          isCorrect ? 'text-green-400' : 'text-red-400'
        }`}>
          {isCorrect ? 'Correct Decision!' : 'Not Quite Right'}
        </h2>
        
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="bg-gray-800 p-3 rounded-md shadow-md">
            <span className="text-sm text-gray-400">Your decision</span>
            <p className="font-semibold text-white">{getDecisionText(decision)}</p>
          </div>
          
          {!isCorrect && (
            <div className="bg-gray-800 p-3 rounded-md shadow-md">
              <span className="text-sm text-gray-400">Better choice</span>
              <p className="font-semibold text-white">{getDecisionText(correctDecision)}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium mb-2 text-blue-300">Explanation:</h3>
        <p className="text-gray-300">{explanation}</p>
      </div>
      
      <div className="flex justify-end">
        <button 
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-md"
          onClick={onNext}
        >
          Next Question
        </button>
      </div>
    </div>
  );
};

export default FeedbackDisplay;