/**
 * Sequence Game Generator
 * Generates mathematical sequences for pattern recognition challenges
 */

// Helper function to get a random integer between min and max (inclusive)
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  
  // Helper function to shuffle an array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  // Generate a linear sequence (arithmetic progression)
  // Example: 3, 7, 11, 15, ... (adding 4 each time)
  const generateLinearSequence = () => {
    const start = getRandomInt(1, 20);
    const increment = getRandomInt(2, 10);
    
    const sequence = [];
    for (let i = 0; i < 5; i++) {
      sequence.push(start + i * increment);
    }
    
    return {
      type: 'linear',
      sequence: sequence.slice(0, 4),
      nextTerm: sequence[4],
      explanation: `This is an arithmetic sequence where each term increases by ${increment}.`,
      difficulty: 'easy'
    };
  };
  
  // Generate a quadratic sequence
  // Example: 2, 5, 10, 17, ... (differences increase by a constant)
  const generateQuadraticSequence = () => {
    const a = getRandomInt(1, 3);
    const b = getRandomInt(1, 5);
    const c = getRandomInt(1, 10);
    
    const sequence = [];
    for (let i = 1; i <= 5; i++) {
      sequence.push(a * i * i + b * i + c);
    }
    
    return {
      type: 'quadratic',
      sequence: sequence.slice(0, 4),
      nextTerm: sequence[4],
      explanation: `This is a quadratic sequence where the second differences are constant (${2*a}).`,
      difficulty: 'medium'
    };
  };
  
  // Generate a geometric sequence (multiplication)
  // Example: 3, 6, 12, 24, ... (multiplying by 2 each time)
  const generateGeometricSequence = () => {
    const start = getRandomInt(1, 5);
    const multiplier = getRandomInt(2, 4);
    
    const sequence = [];
    let current = start;
    for (let i = 0; i < 5; i++) {
      sequence.push(current);
      current *= multiplier;
    }
    
    return {
      type: 'geometric',
      sequence: sequence.slice(0, 4),
      nextTerm: sequence[4],
      explanation: `This is a geometric sequence where each term is multiplied by ${multiplier}.`,
      difficulty: 'easy'
    };
  };
  
  // Generate a power sequence
  // Example: 1, 4, 9, 16, ... (squares of integers)
  const generatePowerSequence = () => {
    const power = getRandomInt(2, 3); // either squares or cubes
    const offset = getRandomInt(1, 3);
    
    const sequence = [];
    for (let i = offset; i < offset + 5; i++) {
      sequence.push(Math.pow(i, power));
    }
    
    return {
      type: 'power',
      sequence: sequence.slice(0, 4),
      nextTerm: sequence[4],
      explanation: `This sequence shows the ${power === 2 ? 'squares' : 'cubes'} of consecutive integers starting from ${offset}.`,
      difficulty: power === 2 ? 'easy' : 'medium'
    };
  };
  
  // Generate a Fibonacci-like sequence
  // Example: 1, 1, 2, 3, 5, ... (each number is the sum of the two preceding ones)
  const generateFibonacciSequence = () => {
    const a = getRandomInt(1, 5);
    const b = getRandomInt(1, 5);
    
    const sequence = [a, b];
    for (let i = 2; i < 5; i++) {
      sequence.push(sequence[i-1] + sequence[i-2]);
    }
    
    return {
      type: 'fibonacci',
      sequence: sequence.slice(0, 4),
      nextTerm: sequence[4],
      explanation: `This is a Fibonacci-like sequence where each term is the sum of the two preceding terms.`,
      difficulty: 'medium'
    };
  };
  
  // Generate a triangular number sequence
  // Example: 1, 3, 6, 10, ... (sum of first n integers)
  const generateTriangularSequence = () => {
    const sequence = [];
    for (let i = 1; i <= 5; i++) {
      sequence.push((i * (i + 1)) / 2);
    }
    
    return {
      type: 'triangular',
      sequence: sequence.slice(0, 4),
      nextTerm: sequence[4],
      explanation: `This sequence shows triangular numbers, where each term is the sum of the first n integers.`,
      difficulty: 'medium'
    };
  };
  
  // Generate an alternating sequence
  // Example: 1, -2, 3, -4, ... (alternating positive and negative with increasing magnitude)
  const generateAlternatingSequence = () => {
    const start = getRandomInt(1, 5);
    const increment = getRandomInt(1, 3);
    
    const sequence = [];
    for (let i = 0; i < 5; i++) {
      const value = start + i * increment;
      sequence.push(i % 2 === 0 ? value : -value);
    }
    
    return {
      type: 'alternating',
      sequence: sequence.slice(0, 4),
      nextTerm: sequence[4],
      explanation: `This is an alternating sequence with sign changes and magnitude increasing by ${increment}.`,
      difficulty: 'medium'
    };
  };
  
  // Generate a prime number sequence
  // Example: 2, 3, 5, 7, ...
  const generatePrimeSequence = () => {
    // First few prime numbers
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
    
    // Select a random starting position (not too close to the end)
    const startIdx = getRandomInt(0, primes.length - 6);
    const selectedPrimes = primes.slice(startIdx, startIdx + 5);
    
    return {
      type: 'prime',
      sequence: selectedPrimes.slice(0, 4),
      nextTerm: selectedPrimes[4],
      explanation: `This sequence shows consecutive prime numbers.`,
      difficulty: 'hard'
    };
  };
  
  // Generate a factorial sequence
  // Example: 1, 2, 6, 24, ... (factorial of increasing integers)
  const generateFactorialSequence = () => {
    const sequence = [];
    let factorial = 1;
    
    for (let i = 1; i <= 5; i++) {
      factorial *= i;
      sequence.push(factorial);
    }
    
    return {
      type: 'factorial',
      sequence: sequence.slice(0, 4),
      nextTerm: sequence[4],
      explanation: `This sequence shows factorials of increasing integers.`,
      difficulty: 'hard'
    };
  };
  
  // Main function to generate a random sequence
  export const generateSequence = (difficulty = 'all') => {
    const generators = [
      { fn: generateLinearSequence, difficulty: 'easy' },
      { fn: generateQuadraticSequence, difficulty: 'medium' },
      { fn: generateGeometricSequence, difficulty: 'easy' },
      { fn: generatePowerSequence, difficulty: 'medium' },
      { fn: generateFibonacciSequence, difficulty: 'medium' },
      { fn: generateTriangularSequence, difficulty: 'medium' },
      { fn: generateAlternatingSequence, difficulty: 'medium' },
      { fn: generatePrimeSequence, difficulty: 'hard' },
      { fn: generateFactorialSequence, difficulty: 'hard' }
    ];
    
    // Filter generators by difficulty if specified
    let availableGenerators = generators;
    if (difficulty !== 'all') {
      availableGenerators = generators.filter(g => g.difficulty === difficulty);
    }
    
    // Select a random generator
    const randomGenerator = availableGenerators[getRandomInt(0, availableGenerators.length - 1)];
    return randomGenerator.fn();
  };
  
  // Generate multiple wrong answers for a sequence
  export const generateWrongAnswers = (correctAnswer, count = 3) => {
    const wrongAnswers = [];
    
    // Simple variations of the correct answer
    wrongAnswers.push(correctAnswer + getRandomInt(1, 5));
    wrongAnswers.push(correctAnswer - getRandomInt(1, 5));
    
    // More complex variations
    wrongAnswers.push(correctAnswer * 2);
    wrongAnswers.push(Math.floor(correctAnswer / 2) + 1);
    wrongAnswers.push(correctAnswer + getRandomInt(6, 10));
    
    // Shuffle and select the requested number of wrong answers
    return shuffleArray(wrongAnswers).slice(0, count);
  };
  
  // Generate a complete question with multiple choice options
  export const generateSequenceQuestion = (difficulty = 'all') => {
    const sequenceData = generateSequence(difficulty);
    const correctAnswer = sequenceData.nextTerm;
    
    // Generate wrong answers
    const wrongAnswers = generateWrongAnswers(correctAnswer, 3);
    
    // Combine and shuffle all answers
    const allAnswers = shuffleArray([...wrongAnswers, correctAnswer]);
    
    return {
      sequence: sequenceData.sequence,
      answers: allAnswers,
      correctAnswer,
      explanation: sequenceData.explanation,
      type: sequenceData.type,
      difficulty: sequenceData.difficulty
    };
  };
  
  // Generate a set of sequence questions
  export const generateSequenceSet = (count, difficulty = 'all') => {
    const questions = [];
    for (let i = 0; i < count; i++) {
      questions.push(generateSequenceQuestion(difficulty));
    }
    return questions;
  };