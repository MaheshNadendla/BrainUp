import React, { useState, useEffect } from 'react';

const AutoPlayGame = ({
  totalItems = 250, // 10x25 Grid
  targetNumber = 42,
  commonNumber = 24,
  distractors = [23, 29],
  playTime = 30, 
  breakTime = 10,
  revealHighlightTime = 5, // Step 1: Just show the number
  revealPopupTime = 5,     // Step 2: Show the coordinates popup
}) => {
  // Game States: 'PLAYING' -> 'REVEAL_HIGHLIGHT' -> 'REVEAL_POPUP' -> 'BREAK'
  const [gameState, setGameState] = useState('PLAYING');
  const [timeLeft, setTimeLeft] = useState(playTime);
  const [level, setLevel] = useState(1);
  
  const [gridNumbers, setGridNumbers] = useState([]);
  const [targetIndex, setTargetIndex] = useState(null);
  const [answerCoords, setAnswerCoords] = useState({ row: 0, col: 0 });

  const generateGrid = () => {
    let newGrid = new Array(totalItems).fill(commonNumber);

    // Add distractors
    for (let i = 0; i < totalItems * 0.05; i++) {
      const r = Math.floor(Math.random() * totalItems);
      newGrid[r] = distractors[Math.floor(Math.random() * distractors.length)];
    }

    // Place Target
    const tIndex = Math.floor(Math.random() * totalItems);
    newGrid[tIndex] = targetNumber;

    const row = Math.floor(tIndex / 10) + 1;
    const col = (tIndex % 10) + 1;

    setGridNumbers(newGrid);
    setTargetIndex(tIndex);
    setAnswerCoords({ row, col });
  };

  useEffect(() => {
    generateGrid();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handlePhaseTransition();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState]);

  const handlePhaseTransition = () => {
    if (gameState === 'PLAYING') {
      // Step 1: Highlight the number
      setGameState('REVEAL_HIGHLIGHT');
      setTimeLeft(revealHighlightTime);
    } else if (gameState === 'REVEAL_HIGHLIGHT') {
      // Step 2: Show the Popup
      setGameState('REVEAL_POPUP');
      setTimeLeft(revealPopupTime);
    } else if (gameState === 'REVEAL_POPUP') {
      // Step 3: Break
      setGameState('BREAK');
      setTimeLeft(breakTime);
    } else if (gameState === 'BREAK') {
      // Step 4: Reset
      setLevel((l) => l + 1);
      generateGrid();
      setGameState('PLAYING');
      setTimeLeft(playTime);
    }
  };

  const getProgressWidth = () => {
    let max;
    if (gameState === 'PLAYING') max = playTime;
    else if (gameState === 'BREAK') max = breakTime;
    else if (gameState === 'REVEAL_HIGHLIGHT') max = revealHighlightTime;
    else max = revealPopupTime; // REVEAL_POPUP
    
    return `${(timeLeft / max) * 100}%`;
  };

  // Helper to check if we are in ANY reveal state
  const isRevealed = gameState === 'REVEAL_HIGHLIGHT' || gameState === 'REVEAL_POPUP';

  return (
    <div className="fixed inset-0 bg-black flex justify-center items-center font-sans overflow-hidden">
      
      {/* Mobile Frame */}
      <div className="w-full max-w-md bg-white h-[100dvh] flex flex-col relative overflow-hidden">
        
        {/* --- Top Bar --- */}
        <div className="bg-gray-900 text-white px-4 py-2 flex justify-between items-center shrink-0 z-20 shadow-md">
          <span className="font-bold text-yellow-400">LEVEL {level}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 uppercase">
              {gameState === 'BREAK' ? 'Next In' : isRevealed ? 'Answer' : 'Time Left'}
            </span>
            <span className={`text-xl font-mono font-bold ${timeLeft <= 5 && gameState === 'PLAYING' ? 'text-red-500' : 'text-white'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>

        {/* --- Progress Bar --- */}
        <div className="h-1 bg-gray-200 w-full shrink-0">
          <div 
            className="h-full bg-red-600 transition-all duration-1000 ease-linear"
            style={{ width: getProgressWidth() }}
          />
        </div>

        {/* --- BIG CENTER POPUP (Only in REVEAL_POPUP state) --- */}
        {gameState === 'REVEAL_POPUP' && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 animate-in fade-in duration-300">
            <div className="bg-white border-4 border-red-600 rounded-xl p-8 shadow-2xl transform scale-110 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300">
              <div className="text-red-600 font-extrabold text-2xl uppercase mb-2 tracking-widest">Answer</div>
              <div className="flex flex-col gap-1">
                <div className="text-5xl font-black text-gray-900">
                  ROW <span className="text-red-600">{answerCoords.row}</span>
                </div>
                <div className="h-1 w-full bg-gray-200 my-2 rounded-full"></div>
                <div className="text-5xl font-black text-gray-900">
                  COL <span className="text-red-600">{answerCoords.col}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- GAME AREA --- */}
        {gameState === 'BREAK' ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 text-white animate-in fade-in">
             <h2 className="text-2xl font-bold mb-4">Next Puzzle Coming...</h2>
             <div className="text-6xl font-black text-yellow-400 mb-2">{timeLeft}</div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col pt-2 pb-2 px-1 relative">
            
            {/* Header Title */}
            <div className="text-center mb-2 shrink-0">
               <h1 className="text-3xl font-extrabold tracking-tight text-black">
                 FIND ={'>'} <span className="underline decoration-4 underline-offset-4">{targetNumber}</span>
               </h1>
            </div>

            {/* --- GRID CONTAINER --- */}
            <div className="flex-1 flex justify-center overflow-hidden">
              <div className="flex">
                
                {/* 1. Left Sidebar (Row Numbers) */}
                <div className="flex flex-col justify-around pr-1 pt-6 text-[10px] text-gray-400 font-mono select-none border-r border-gray-100">
                  {Array.from({ length: 25 }, (_, i) => (
                    <div key={i} className={`h-full flex items-center justify-end pr-1 ${isRevealed && (i + 1) === answerCoords.row ? 'text-red-600 font-bold scale-125 transition-transform duration-300' : ''}`}>
                      {i + 1}
                    </div>
                  ))}
                </div>

                {/* 2. Main Content (Top Cols + Grid) */}
                <div className="flex flex-col">
                  
                  {/* Top Bar (Column Numbers) */}
                  <div className="grid grid-cols-10 gap-x-1 mb-1 text-[10px] text-gray-400 font-mono text-center select-none pl-1">
                    {Array.from({ length: 10 }, (_, i) => (
                      <div key={i} className={isRevealed && (i + 1) === answerCoords.col ? 'text-red-600 font-bold scale-125 transition-transform duration-300' : ''}>
                        {i + 1}
                      </div>
                    ))}
                  </div>

                  {/* The Numbers Grid */}
                  <div className="grid grid-cols-10 gap-x-1 pl-1">
                    {gridNumbers.map((num, index) => {
                      const isTarget = index === targetIndex;
                      // Highlight if in ANY reveal state
                      const isHighlighted = isRevealed && isTarget;
                      const isDimmed = isRevealed && !isTarget;

                      return (
                        <div
                          key={index}
                          className={`
                            w-7 py-0.5 flex items-center justify-center
                            text-center font-bold text-lg select-none leading-none
                            transition-all duration-500
                            ${isHighlighted ? 'bg-red-600 text-white rounded shadow-sm z-10 scale-110' : ''}
                            ${isDimmed ? 'opacity-30 blur-[1px]' : 'text-gray-900'}
                          `}
                        >
                          {num}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pb-4 pt-1 text-center shrink-0 bg-white z-10">
             <div className="flex justify-center items-center gap-2 text-gray-400 text-xs font-medium tracking-wide">
                <span>PRISM Live</span>
             </div>
        </div>

      </div>
    </div>
  );
};

export default AutoPlayGame;