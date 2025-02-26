/**
 * Improved question generator for the Optiver 80 in 8 challenge
 * 
 * Improvements:
 * - Cleaner question formatting
 * - More intuitive presentation
 * - Better random number ranges for appropriate difficulty
 * - More natural percentage questions
 * - Improved decimal handling
 */

// Helper function to get a random integer between min and max (inclusive)
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper function to round to decimal places
const roundToDecimal = (num, places) => {
  return parseFloat(num.toFixed(places));
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

// Generate addition or subtraction question
const generateAddSubtract = () => {
  const isAddition = Math.random() > 0.5;
  const num1 = getRandomInt(10, 999);
  const num2 = getRandomInt(10, 999);
  
  let correctAnswer, displayQuestion;
  
  if (isAddition) {
    correctAnswer = num1 + num2;
    displayQuestion = `${num1} + ${num2}`;
  } else {
    // Ensure the result is positive for subtraction
    if (num1 >= num2) {
      correctAnswer = num1 - num2;
      displayQuestion = `${num1} - ${num2}`;
    } else {
      correctAnswer = num2 - num1;
      displayQuestion = `${num2} - ${num1}`;
    }
  }
  
  // Generate 3 wrong answers that are close to the correct answer
  const wrongAnswers = [
    correctAnswer + getRandomInt(1, 5),
    correctAnswer - getRandomInt(1, 5),
    isAddition ? correctAnswer + getRandomInt(6, 10) : correctAnswer - getRandomInt(6, 10)
  ];
  
  const answers = shuffleArray([...wrongAnswers, correctAnswer]);
  
  return {
    type: 'add_subtract',
    displayQuestion,
    correctAnswer,
    answers
  };
};

// Generate multiplication question
const generateMultiplication = () => {
  const num1 = getRandomInt(2, 20);
  const num2 = getRandomInt(2, 20);
  
  const correctAnswer = num1 * num2;
  const displayQuestion = `${num1} × ${num2}`;
  
  // Generate 3 wrong answers that are close to the correct answer
  const wrongAnswers = [
    correctAnswer + getRandomInt(1, 10),
    correctAnswer - getRandomInt(1, 10),
    correctAnswer + getRandomInt(11, 20)
  ];
  
  const answers = shuffleArray([...wrongAnswers, correctAnswer]);
  
  return {
    type: 'multiplication',
    displayQuestion,
    correctAnswer,
    answers
  };
};

// Generate division question
const generateDivision = () => {
  // Create cleaner division problems with integer divisors and cleaner results
  const divisor = getRandomInt(2, 12);
  const quotient = getRandomInt(1, 12);
  const dividend = divisor * quotient;
  
  // Sometimes make it a decimal result by adding a half
  const useDecimal = Math.random() > 0.7;
  let correctAnswer, displayQuestion;
  
  if (useDecimal) {
    const decimalDividend = dividend + divisor/2;
    correctAnswer = quotient + 0.5;
    displayQuestion = `${decimalDividend} ÷ ${divisor}`;
  } else {
    correctAnswer = quotient;
    displayQuestion = `${dividend} ÷ ${divisor}`;
  }
  
  // Generate 3 wrong answers that are close to the correct answer
  const wrongAnswers = [
    useDecimal ? roundToDecimal(correctAnswer + 0.5, 1) : correctAnswer + 1,
    useDecimal ? roundToDecimal(correctAnswer - 0.5, 1) : (correctAnswer > 1 ? correctAnswer - 1 : correctAnswer + 2),
    useDecimal ? roundToDecimal(correctAnswer + 1, 1) : correctAnswer + 2
  ];
  
  const answers = shuffleArray([...wrongAnswers, correctAnswer]);
  
  return {
    type: 'division',
    displayQuestion,
    correctAnswer,
    answers
  };
};

// Generate percentage question with more intuitive formatting
const generatePercentage = () => {
  const types = [
    // What is X% of Y?
    () => {
      const percentage = getRandomInt(5, 90);
      const value = getRandomInt(20, 200);
      const correctAnswer = roundToDecimal((percentage / 100) * value, 1);
      return {
        displayQuestion: `${percentage}% of ${value}`,
        correctAnswer
      };
    },
    // X is what percentage of Y?
    () => {
      const whole = getRandomInt(50, 200);
      let part = getRandomInt(5, whole);
      
      // Make the part a nice percentage of the whole
      const nicePercentages = [10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90];
      const selectedPercentage = nicePercentages[getRandomInt(0, nicePercentages.length - 1)];
      part = Math.round(whole * selectedPercentage / 100);
      
      const correctAnswer = selectedPercentage;
      return {
        displayQuestion: `${part} is what % of ${whole}?`,
        correctAnswer
      };
    }
  ];
  
  const selectedType = types[getRandomInt(0, types.length - 1)]();
  
  // Generate 3 wrong answers that are reasonable for percentages
  let wrongAnswers;
  
  if (selectedType.correctAnswer < 10) {
    // For small percentages, use closer wrong answers
    wrongAnswers = [
      roundToDecimal(selectedType.correctAnswer * 2, 1),
      roundToDecimal(selectedType.correctAnswer + 2, 1),
      roundToDecimal(selectedType.correctAnswer + 5, 1)
    ];
  } else {
    wrongAnswers = [
      roundToDecimal(selectedType.correctAnswer * 0.5, 1),
      roundToDecimal(selectedType.correctAnswer * 1.5, 1),
      roundToDecimal(selectedType.correctAnswer + 10, 1)
    ];
  }
  
  const answers = shuffleArray([...wrongAnswers, selectedType.correctAnswer]);
  
  return {
    type: 'percentage',
    displayQuestion: selectedType.displayQuestion,
    correctAnswer: selectedType.correctAnswer,
    answers
  };
};

// Generate missing number question (solve for x) with clearer formatting
const generateMissingNumber = () => {
  const operations = [
    // x + a = b
    () => {
      const a = getRandomInt(5, 50);
      const x = getRandomInt(5, 50);
      const b = x + a;
      return {
        displayQuestion: `? + ${a} = ${b}`,
        correctAnswer: x
      };
    },
    // a - x = b
    () => {
      const x = getRandomInt(5, 50);
      const b = getRandomInt(5, 50);
      const a = b + x;
      return {
        displayQuestion: `${a} - ? = ${b}`,
        correctAnswer: x
      };
    },
    // a × x = b
    () => {
      const a = getRandomInt(2, 12);
      const x = getRandomInt(2, 12);
      const b = a * x;
      return {
        displayQuestion: `${a} × ? = ${b}`,
        correctAnswer: x
      };
    },
    // a ÷ x = b
    () => {
      const x = getRandomInt(2, 12);
      const b = getRandomInt(2, 12);
      const a = b * x;
      return {
        displayQuestion: `${a} ÷ ? = ${b}`,
        correctAnswer: x
      };
    }
  ];
  
  const selectedOperation = operations[getRandomInt(0, operations.length - 1)]();
  
  // Generate 3 wrong answers that are close to the correct answer
  const wrongAnswers = [
    selectedOperation.correctAnswer + getRandomInt(1, 5),
    selectedOperation.correctAnswer - getRandomInt(1, 5),
    selectedOperation.correctAnswer + getRandomInt(6, 10) * (Math.random() > 0.5 ? 1 : -1)
  ].filter(answer => answer > 0); // Ensure positive answers
  
  // If we filtered out too many answers, add some more
  while (wrongAnswers.length < 3) {
    wrongAnswers.push(selectedOperation.correctAnswer + getRandomInt(1, 10));
  }
  
  const answers = shuffleArray([...wrongAnswers, selectedOperation.correctAnswer]);
  
  return {
    type: 'missing_number',
    displayQuestion: selectedOperation.displayQuestion,
    correctAnswer: selectedOperation.correctAnswer,
    answers
  };
};

// Generate equation with fractions or decimals, with cleaner presentation
const generateFractionDecimal = () => {
  const types = [
    // Decimal + Decimal - use full numbers with a .5 to make it easier
    () => {
      const a = getRandomInt(1, 20) + (Math.random() > 0.5 ? 0.5 : 0);
      const b = getRandomInt(1, 20) + (Math.random() > 0.5 ? 0.5 : 0);
      const correctAnswer = roundToDecimal(a + b, 1);
      return {
        displayQuestion: `${a} + ${b}`,
        correctAnswer
      };
    },
    // Decimal - Decimal with clean results
    () => {
      const b = getRandomInt(1, 20) + (Math.random() > 0.5 ? 0.5 : 0);
      const correctAnswer = getRandomInt(1, 20) + (Math.random() > 0.5 ? 0.5 : 0);
      const a = roundToDecimal(b + correctAnswer, 1);
      return {
        displayQuestion: `${a} - ${b}`,
        correctAnswer
      };
    },
    // Decimal × Integer with nice round numbers
    () => {
      const a = getRandomInt(1, 10) + 0.5;
      const b = getRandomInt(2, 10);
      const correctAnswer = roundToDecimal(a * b, 1);
      return {
        displayQuestion: `${a} × ${b}`,
        correctAnswer
      };
    },
    // Decimal ÷ Integer with cleaner results
    () => {
      const b = 2; // Start with easy divisors
      const correctAnswer = getRandomInt(1, 10) + 0.5;
      const a = roundToDecimal(correctAnswer * b, 1);
      return {
        displayQuestion: `${a} ÷ ${b}`,
        correctAnswer
      };
    }
  ];
  
  const selectedType = types[getRandomInt(0, types.length - 1)]();
  
  // Generate 3 wrong answers that are close to the correct answer
  const wrongAnswers = [
    roundToDecimal(selectedType.correctAnswer + 0.5, 1),
    roundToDecimal(selectedType.correctAnswer - 0.5, 1),
    roundToDecimal(selectedType.correctAnswer + 1.0, 1)
  ];
  
  const answers = shuffleArray([...wrongAnswers, selectedType.correctAnswer]);
  
  return {
    type: 'fraction_decimal',
    displayQuestion: selectedType.displayQuestion,
    correctAnswer: selectedType.correctAnswer,
    answers
  };
};

// Main function to generate a random question
export const generateQuestion = () => {
  const questionTypes = [
    generateAddSubtract,
    generateMultiplication,
    generateDivision,
    generatePercentage,
    generateMissingNumber,
    generateFractionDecimal
  ];
  
  const randomType = questionTypes[getRandomInt(0, questionTypes.length - 1)];
  return randomType();
};

// Generate a set of questions for testing
export const generateQuestionSet = (count) => {
  const questions = [];
  for (let i = 0; i < count; i++) {
    questions.push(generateQuestion());
  }
  return questions;
};