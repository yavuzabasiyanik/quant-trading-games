// import axios from 'axios';
import { stockSymbols } from '../data/stockSymbols';

// This is a placeholder function for demo purposes
// In a real app, you would fetch from an API or server
export async function getRandomScenario() {
  // For demo purposes, we'll use mock data
  // In a real implementation, use API like:
  // const response = await axios.get('https://api.example.com/stock-data');
  
  // Pick a random stock from our list
  const randomIndex = Math.floor(Math.random() * stockSymbols.length);
  const symbol = stockSymbols[randomIndex].symbol;
  const companyName = stockSymbols[randomIndex].name;
  
  // Generate a random scenario type
  const scenarioTypes = ['breakout', 'reversal', 'trend', 'support', 'resistance'];
  const scenarioType = scenarioTypes[Math.floor(Math.random() * scenarioTypes.length)];
  
  // In a real implementation, you would:
  // 1. Fetch historical data for the chosen symbol
  // 2. Analyze the data to find interesting patterns
  // 3. Choose a specific point in time to quiz on
  // 4. Return all the data needed for the quiz

  // Mock data structure for demo
  const mockData = generateMockStockData(scenarioType);
  
  // Determine correct answer based on scenario
  const correctDecision = determineCorrectDecision(scenarioType, mockData);
  
  return {
    symbol,
    companyName,
    date: "2023-05-15", // This would be dynamic in a real implementation
    data: mockData,
    description: generateDescription(symbol, companyName, scenarioType),
    correctDecision,
    explanation: generateExplanation(symbol, scenarioType, correctDecision),
  };
}

function generateDescription(symbol, companyName, scenarioType) {
  const descriptions = {
    breakout: `${symbol} (${companyName}) has been trading in a tight range for several weeks. Volume has been increasing over the past few days. Is this a potential breakout opportunity?`,
    reversal: `${symbol} (${companyName}) has been in a strong downtrend but is showing signs of slowing momentum. The most recent candles show potential reversal patterns. What's your move?`,
    trend: `${symbol} (${companyName}) has been in a consistent uptrend for the past month. There's been some recent consolidation. Would you continue with the trend or expect a reversal?`,
    support: `${symbol} (${companyName}) has pulled back to a key support level that has held multiple times in the past. How would you trade this situation?`,
    resistance: `${symbol} (${companyName}) is approaching a significant resistance level that has rejected the price several times before. What's your trading decision?`,
  };
  
  return descriptions[scenarioType] || `Analyze this trading opportunity for ${symbol} (${companyName}).`;
}

function generateExplanation(symbol, scenarioType, correctDecision) {
  const baseExplanations = {
    breakout: {
      buy: `${symbol} showed a valid breakout with increasing volume and momentum. Going long was the right move as the price continued to rise above resistance.`,
      short: `Despite appearing like a breakout setup, ${symbol} actually failed and reversed. The high volume was actually distribution, making a short position profitable.`,
      hold: `This was a tricky situation for ${symbol}. The breakout signals were mixed, and the price ended up moving sideways with high volatility. Staying out was the prudent move.`,
    },
    reversal: {
      buy: `The downtrend in ${symbol} was exhausted, and key reversal candlestick patterns signaled a trend change. Buying at this point captured the beginning of a new uptrend.`,
      short: `Despite reversal signals, ${symbol} continued its downtrend after a brief pause. The overall market conditions remained bearish, so shorting was the optimal strategy.`,
      hold: `${symbol} showed mixed signals with both bullish and bearish indicators present. The price action remained choppy afterward, making a hold decision appropriate.`,
    },
    trend: {
      buy: `The consolidation in ${symbol} was just a pause in the larger uptrend. The trend resumed with strength, rewarding those who bought the dip.`,
      short: `While ${symbol} had been in an uptrend, key exhaustion signals appeared at this point. The trend reversed sharply afterward, making a short position very profitable.`,
      hold: `${symbol} entered an extended period of choppy, sideways movement after this point. Neither a long nor short position would have performed well.`,
    },
    support: {
      buy: `${symbol} bounced strongly off this historical support level, which held once again. Buying at support proved to be an excellent entry point for a new upward move.`,
      short: `This time, the support level for ${symbol} failed to hold. The breakdown was significant and led to further downside, making a short position the right call.`,
      hold: `${symbol} bounced weakly off support but lacked momentum for a significant move either way. The price remained range-bound, so avoiding this trade saved you from potential whipsaw.`,
    },
    resistance: {
      buy: `${symbol} broke through the key resistance level with conviction and high volume. This breakout led to a significant upward movement that rewarded buyers.`,
      short: `As expected, ${symbol} rejected off this strong resistance level and reversed course. Shorting at resistance captured a nice downward move.`,
      hold: `${symbol} reached resistance and then entered a prolonged consolidation period. Neither a long nor short position would have performed well in this choppy environment.`,
    },
  };
  
  return baseExplanations[scenarioType]?.[correctDecision] || 
    `Based on the price action and indicators, ${correctDecision} was the optimal trading decision for ${symbol} at this point.`;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function determineCorrectDecision(scenarioType, data) {
  // In a real implementation, you would analyze the data and determine
  // the correct decision based on what actually happened
  
  // For demo purposes, we'll just randomly assign a correct decision
  const decisions = ['buy', 'short', 'hold'];
  return decisions[Math.floor(Math.random() * decisions.length)];
}

function generateMockStockData(scenarioType) {
  // Generate 30 days of mock stock data
  // 25 days for display and 5 days for "future" after decision
  const data = [];
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 30);
  
  let basePrice = 100 + Math.random() * 150; // Random starting price between 100-250
  let volatility = 0.015; // Base volatility
  
  // Adjust based on scenario type
  let trendBias = 0;
  
  switch (scenarioType) {
    case 'breakout':
      // Tight range followed by a move
      volatility = 0.008;
      trendBias = 0.003;
      break;
    case 'reversal':
      // Downtrend that might reverse
      trendBias = -0.004;
      volatility = 0.018;
      break;
    case 'trend':
      // Strong trend
      trendBias = 0.005;
      volatility = 0.012;
      break;
    case 'support':
      // Downtrend to support
      trendBias = -0.003;
      volatility = 0.014;
      break;
    case 'resistance':
      // Uptrend to resistance
      trendBias = 0.004;
      volatility = 0.013;
      break;
  }
  
  let lastClose = basePrice;
  
  // Generate historical data
  for (let i = 0; i < 30; i++) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + i);
    
    // Adjust the trend bias for future data points (after decision point)
    if (i >= 25) {
      // For the "future" data, we might reverse the trend or accelerate it
      // depending on the correct decision that will be made
      if (Math.random() > 0.5) {
        trendBias = -trendBias * (1 + Math.random());
      } else {
        trendBias = trendBias * (1 + Math.random());
      }
      
      // Increase volatility for dramatic effect
      volatility = volatility * 1.3;
    }
    
    // Calculate daily range
    const changePercent = (Math.random() * 2 - 1) * volatility + trendBias;
    const range = lastClose * volatility;
    
    const open = lastClose;
    let close = open * (1 + changePercent);
    
    // Ensure price doesn't go negative
    close = Math.max(close, 0.1);
    
    const high = Math.max(open, close) + Math.random() * range * 0.5;
    const low = Math.min(open, close) - Math.random() * range * 0.5;
    
    // Generate realistic volume
    const volume = Math.round(100000 + Math.random() * 900000);
    
    data.push({
      time: formatDate(date),
      open,
      high,
      low,
      close,
      volume
    });
    
    lastClose = close;
  }
  
  return data;
}

// Helper function to format date for the chart
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}