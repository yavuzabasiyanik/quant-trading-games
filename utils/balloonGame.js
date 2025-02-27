/**
 * Risk Game - Balloon Pop Game Logic
 * 
 * This game is about risk assessment and decision making.
 * Players have 30 rounds to collect points by inflating a balloon.
 * Each pump adds a point to the balloon but increases the chance of it popping.
 * If the balloon pops, the player loses all points for that round.
 * Players must decide when to "cash in" their points versus taking more risk.
 */

// Function to calculate the probability of popping based on current size
const calculatePopProbability = (pumpCount) => {
    // Initial low probability that increases with each pump
    // Starting with a 1% chance, increasing non-linearly
    return Math.min(0.01 + (pumpCount * pumpCount * 0.0025), 0.99);
  };
  
  // Check if balloon pops based on current probability
  const doesBalloonPop = (pumpCount) => {
    const probability = calculatePopProbability(pumpCount);
    return Math.random() < probability;
  };
  
  // Calculate the visual size of the balloon based on pump count
  const calculateBalloonSize = (pumpCount) => {
    // Start with a base size and increase with each pump, with diminishing returns
    const baseSize = 50; // base size in pixels
    const maxSize = 300; // maximum size in pixels
    
    // Non-linear growth function - starts faster, slows down as it gets bigger
    const size = baseSize + (maxSize - baseSize) * (1 - Math.exp(-0.1 * pumpCount));
    
    return Math.min(size, maxSize);
  };
  
  // Calculate the color of the balloon based on risk level
  const calculateBalloonColor = (pumpCount) => {
    // Change color as risk increases: green -> yellow -> orange -> red
    const riskLevel = calculatePopProbability(pumpCount);
    
    if (riskLevel < 0.25) {
      return '#4ade80'; // green
    } else if (riskLevel < 0.5) {
      return '#facc15'; // yellow
    } else if (riskLevel < 0.75) {
      return '#fb923c'; // orange
    } else {
      return '#ef4444'; // red
    }
  };
  
  // Calculate the "stress" animation level (vibration/pulsing) based on risk
  const calculateStressLevel = (pumpCount) => {
    const riskLevel = calculatePopProbability(pumpCount);
    
    if (riskLevel < 0.3) {
      return 'none';
    } else if (riskLevel < 0.6) {
      return 'low';
    } else if (riskLevel < 0.8) {
      return 'medium';
    } else {
      return 'high';
    }
  };
  
  // Function to determine recommendation based on risk level
  // This is used for hints/suggestions for new players
  const getBalloonRecommendation = (pumpCount) => {
    const riskLevel = calculatePopProbability(pumpCount);
    
    if (riskLevel < 0.2) {
      return 'Low risk. Safe to continue pumping.';
    } else if (riskLevel < 0.4) {
      return 'Moderate risk. Consider collecting soon.';
    } else if (riskLevel < 0.6) {
      return 'Substantial risk. Collecting now would be prudent.';
    } else if (riskLevel < 0.8) {
      return 'High risk! Collecting strongly recommended.';
    } else {
      return 'Extreme risk! The balloon could pop any moment.';
    }
  };
  
  // Generate statistics about a player's risk-taking behavior
  const generateRiskProfile = (gameHistory) => {
    if (!gameHistory || gameHistory.length === 0) {
      return {
        averagePumps: 0,
        poppedBalloons: 0,
        totalPoints: 0,
        maxPumps: 0,
        riskProfile: 'No data available'
      };
    }
    
    const averagePumps = gameHistory.reduce((sum, round) => sum + round.pumps, 0) / gameHistory.length;
    const poppedBalloons = gameHistory.filter(round => round.popped).length;
    const totalPoints = gameHistory.reduce((sum, round) => sum + (round.popped ? 0 : round.pumps), 0);
    const maxPumps = Math.max(...gameHistory.map(round => round.pumps));
    
    let riskProfile;
    if (averagePumps < 3) {
      riskProfile = 'Very Conservative';
    } else if (averagePumps < 6) {
      riskProfile = 'Conservative';
    } else if (averagePumps < 10) {
      riskProfile = 'Moderate';
    } else if (averagePumps < 15) {
      riskProfile = 'Aggressive';
    } else {
      riskProfile = 'Very Aggressive';
    }
    
    return {
      averagePumps,
      poppedBalloons,
      totalPoints,
      maxPumps,
      riskProfile
    };
  };
  
  // Get expected value (EV) for a given number of pumps
  // This is used for analytics and player feedback
  const getExpectedValue = (pumpCount) => {
    const popProbability = calculatePopProbability(pumpCount);
    const ev = (1 - popProbability) * pumpCount; // EV = probability of success × reward
    return parseFloat(ev.toFixed(2));
  };
  
  // Export functions for use in the game component
  export {
    calculatePopProbability,
    doesBalloonPop,
    calculateBalloonSize,
    calculateBalloonColor,
    calculateStressLevel,
    getBalloonRecommendation,
    generateRiskProfile,
    getExpectedValue
  };