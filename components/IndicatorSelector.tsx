// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React from 'react';

const indicators = [
  { id: 'sma', name: 'SMA (20)' },
  { id: 'ema', name: 'EMA (20)' },
  { id: 'bollinger', name: 'Bollinger Bands' },
  { id: 'volume', name: 'Volume' },
  { id: 'rsi', name: 'RSI' },
  { id: 'macd', name: 'MACD' },
];

const IndicatorSelector = ({ selectedIndicators, onToggle }) => {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-medium mb-2 text-blue-300">Technical Indicators</h3>
      
      <div className="flex flex-wrap gap-3">
        {indicators.map((indicator) => (
          <button
            key={indicator.id}
            className={`px-4 py-2 rounded-md border transition-colors ${
              selectedIndicators.includes(indicator.id)
                ? 'bg-blue-600 text-white border-blue-700'
                : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
            }`}
            onClick={() => onToggle(indicator.id)}
          >
            {indicator.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default IndicatorSelector;