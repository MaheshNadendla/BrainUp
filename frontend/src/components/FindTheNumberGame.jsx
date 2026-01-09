import React, { useState, useEffect } from 'react';

const FindTheNumberGame = ({
  totalItems = 240,
  targetNumber = 42,
  commonNumber = 24,
  distractors = [23, 29],
  title = "PRISM Live"
}) => {
  const [gridNumbers, setGridNumbers] = useState([]);
  const [hasWon, setHasWon] = useState(false);
  const [wrongClickIndex, setWrongClickIndex] = useState(null);

  const initializeGame = () => {
    setHasWon(false);
    setWrongClickIndex(null);

    // 1. Fill array with common number
    let newGrid = new Array(totalItems).fill(commonNumber);

    // 2. Add some random distractors (approx 5% of grid)
    for (let i = 0; i < totalItems * 0.05; i++) {
      const randomIndex = Math.floor(Math.random() * totalItems);
      const randomDistractor = distractors[Math.floor(Math.random() * distractors.length)];
      newGrid[randomIndex] = randomDistractor;
    }

    // 3. Place the Target Number (Ensure it overwrites whatever is there)
    const winningIndex = Math.floor(Math.random() * totalItems);
    newGrid[winningIndex] = targetNumber;

    setGridNumbers(newGrid);
  };

  useEffect(() => {
    initializeGame();
  }, [targetNumber, commonNumber, totalItems]); // Re-run if props change

  const handleNumberClick = (number, index) => {
    if (number === targetNumber) {
      setHasWon(true);
    } else {
      // Visual feedback for wrong click
      setWrongClickIndex(index);
      setTimeout(() => setWrongClickIndex(null), 300);
    }
  };

  return (
    <div className="min-h-screen bg-black flex justify-center items-center font-sans">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-md bg-white min-h-[100dvh] md:min-h-[800px] md:h-auto flex flex-col relative overflow-hidden">
        
        {/* Header */}
        <div className="pt-12 pb-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-black">
            FIND ={'>'} <span className="underline decoration-4 underline-offset-4">{targetNumber}</span>
          </h1>
        </div>

        {/* The Grid */}
        <div className="flex-1 px-2 pb-4">
          <div className="grid grid-cols-10 gap-y-1 gap-x-0.5">
            {gridNumbers.map((num, index) => (
              <button
                key={index}
                onClick={() => handleNumberClick(num, index)}
                disabled={hasWon}
                className={`
                  text-center font-bold text-lg select-none transition-colors duration-100
                  ${num === targetNumber && hasWon ? 'bg-green-500 text-white rounded-full' : ''}
                  ${wrongClickIndex === index ? 'text-red-500' : 'text-gray-900'}
                  active:scale-90
                `}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Footer / Attribution - ADDED EXTRA SPACE HERE (pb-12) */}
        <div className="pb-12 pt-4 text-center">
             <div className="flex justify-center items-center gap-2 text-gray-400 text-sm font-medium tracking-wide">
                <span>{title}</span>
             </div>
        </div>

        {/* Win Overlay Modal */}
        {hasWon && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50 animate-in fade-in duration-300">
            <h2 className="text-5xl font-black text-white mb-4 drop-shadow-lg">FOUND IT!</h2>
            <div className="text-8xl mb-8">🎉</div>
            <button 
              onClick={initializeGame}
              className="px-8 py-3 bg-white text-black font-bold text-xl rounded-full hover:bg-gray-200 active:scale-95 transition-all"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindTheNumberGame;