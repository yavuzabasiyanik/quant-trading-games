# Trading Games Platform

A collection of interactive games designed to improve quantitative and trading skills.

## Overview

This platform offers various mental games to help users develop skills relevant to trading, finance, and quantitative reasoning. Each game focuses on different cognitive abilities such as mental math, pattern recognition, and decision-making under time pressure.

## Games

### Active Games

1. **Trading Quiz**
   - Make trading decisions based on chart patterns and market scenarios
   - Practice technical analysis skills in a simulated environment
   - Receive immediate feedback and explanations

2. **Optiver 80 in 8 Challenge**
   - Solve 80 arithmetic problems in 8 minutes
   - Scoring: +1 point for correct answers, -2 points for incorrect answers
   - Skip questions without penalty
   - Question types include:
     - Addition/subtraction with 2-3 digit numbers
     - Multiplication of 2-digit numbers
     - Division with whole or decimal results
     - Percentage calculations
     - Missing number problems
     - Operations with fractions and decimals

### Upcoming Games

- **Pattern Game**: Identify and predict market patterns
- **Sequence Game**: Complete numerical sequences and patterns
- **Memory Game**: Test and improve short-term memory capabilities
- **Risk Game**: Practice risk/reward decision making
- **Arithmetic Game**: Additional mental math challenges
- **Flexibility Game**: Test cognitive flexibility and adaptability

## Technical Implementation

This platform is built with:
- React/Next.js for the frontend
- Tailwind CSS for styling
- JavaScript for game logic

### Key Components

- **optiverQuestions.js**: Question generator for the Optiver 80 in 8 challenge
- **pages/index.js**: Main landing page with game selection
- **pages/quiz.js**: Trading quiz implementation
- **pages/optiver.js**: Optiver 80 in 8 challenge implementation

## Local Development

1. Clone the repository
2. Install dependencies:
```
npm install
```
3. Run the development server:
```
npm run dev
```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
/
├── components/               # Reusable React components
├── pages/                    # Next.js pages
│   ├── index.js              # Landing page
│   ├── quiz.js               # Trading quiz game
│   └── optiver.js            # Optiver 80 in 8 challenge
├── utils/                    # Utility functions
│   ├── optiverQuestions.js   # Question generator for Optiver game
│   └── quizGenerator.js      # Scenario generator for Trading quiz
└── public/                   # Static assets
```

## Contributing

Contributions are welcome! If you'd like to add a new game or improve existing ones:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Inspiration

The Optiver 80 in 8 Challenge is inspired by Optiver's trading interview test, which requires candidates to perform 80 mental math calculations in 8 minutes to demonstrate quick and accurate numerical thinking—a critical skill for traders.