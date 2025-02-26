// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React from 'react';

const TradingDecision = ({ onDecision }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
      <h2 className="text-xl font-bold mb-6 text-blue-300">What&apos;s your trading decision?</h2>
      
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-md flex-1 max-w-xs"
          onClick={() => onDecision('buy')}
        >
          <span className="block text-xl mb-1">Buy</span>
          <span className="block text-sm text-green-100">Go long on this stock</span>
        </button>
        
        <button
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-md flex-1 max-w-xs"
          onClick={() => onDecision('short')}
        >
          <span className="block text-xl mb-1">Short</span>
          <span className="block text-sm text-red-100">Go short on this stock</span>
        </button>
        
        <button
          className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors shadow-md flex-1 max-w-xs"
          onClick={() => onDecision('hold')}
        >
          <span className="block text-xl mb-1">Hold</span>
          <span className="block text-sm text-gray-300">Stay out of this trade</span>
        </button>
      </div>
    </div>
  );
};

export default TradingDecision;