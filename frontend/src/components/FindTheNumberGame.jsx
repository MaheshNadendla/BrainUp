import React, { useState, useEffect } from 'react';

const FindTheNumberGame = ({
  // Reduced to 160 (10x16 grid) to fit safe area on most phones
  totalItems = 160,
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

    // 3. Place the Target Number
    const winningIndex = Math.floor(Math.random() * totalItems);
    newGrid[winningIndex] = targetNumber;

    setGridNumbers(newGrid);
  };

  useEffect(() => {
    initializeGame();
  }, [totalItems]);

  const handleNumberClick = (number, index) => {
    if (number === targetNumber) {
      setHasWon(true);
    } else {
      setWrongClickIndex(index);
      setTimeout(() => setWrongClickIndex(null), 300);
    }
  };

  return (
    // Outer wrapper: Locks background and centers content
    <div className="fixed inset-0 bg-black flex justify-center items-center font-sans overflow-hidden">
      
      {/* Mobile Frame: Forces exact 100dvh height, no scrolling allowed */}
      <div className="w-full max-w-md bg-white h-[100dvh] flex flex-col relative overflow-hidden">
        
        {/* Header */}
        <div className="pt-8 pb-4 text-center shrink-0">
          <h1 className="text-4xl font-extrabold tracking-tight text-black">
            FIND ={'>'} <span className="underline decoration-4 underline-offset-4">{targetNumber}</span>
          </h1>
        </div>

        {/* The Grid: Flex-1 ensures it takes remaining space, content centered */}
        <div className="flex-1 flex items-center justify-center px-2">
          <div className="grid grid-cols-10 gap-y-0 gap-x-0.5">
            {gridNumbers.map((num, index) => (
              <button
                key={index}
                onClick={() => handleNumberClick(num, index)}
                disabled={hasWon}
                // 'h-8' or 'h-9' ensures buttons don't grow too tall
                className={`
                  w-8 h-9 flex items-center justify-center
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

        {/* Footer: shrink-0 ensures it stays at bottom without getting squashed */}
        <div className="pb-8 pt-2 text-center shrink-0">
             <div className="flex justify-center items-center gap-2 text-gray-400 text-sm font-medium tracking-wide">
                <span>{title}</span>
             </div>
        </div>

        {/* Win Overlay */}
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