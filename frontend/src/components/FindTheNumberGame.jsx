// import React, { useState, useEffect } from 'react';

// const AutoPlayGame = ({
//   rows = 25,
//   cols = 10,
//   targetNumber = 42,
//   commonNumber = 24,
//   distractors = [23, 29],
//   playTime = 30, 
//   breakTime = 6,
//   revealHighlightTime = 4,
//   revealPopupTime = 4,
// }) => {
//   const totalItems = rows * cols;
  
//   const [gameState, setGameState] = useState('PLAYING');
//   const [timeLeft, setTimeLeft] = useState(playTime);
//   const [level, setLevel] = useState(1);
  
//   // We store the grid as a 1D array, but we'll slice it when rendering
//   const [gridNumbers, setGridNumbers] = useState([]);
//   const [targetIndex, setTargetIndex] = useState(null);
//   const [answerCoords, setAnswerCoords] = useState({ row: 0, col: 0 });

//   const generateGrid = () => {
//     let newGrid = new Array(totalItems).fill(commonNumber);

//     // Add distractors
//     for (let i = 0; i < totalItems * 0.05; i++) {
//       const r = Math.floor(Math.random() * totalItems);
//       newGrid[r] = distractors[Math.floor(Math.random() * distractors.length)];
//     }

//     // Place Target
//     const tIndex = Math.floor(Math.random() * totalItems);
//     newGrid[tIndex] = targetNumber;

//     const row = Math.floor(tIndex / cols) + 1;
//     const col = (tIndex % cols) + 1;

//     setGridNumbers(newGrid);
//     setTargetIndex(tIndex);
//     setAnswerCoords({ row, col });
//   };

//   useEffect(() => {
//     generateGrid();
//   }, []);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           handlePhaseTransition();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//     return () => clearInterval(timer);
//   }, [gameState]);

//   const handlePhaseTransition = () => {
//     if (gameState === 'PLAYING') {
//       setGameState('REVEAL_HIGHLIGHT');
//       setTimeLeft(revealHighlightTime);
//     } else if (gameState === 'REVEAL_HIGHLIGHT') {
//       setGameState('REVEAL_POPUP');
//       setTimeLeft(revealPopupTime);
//     } else if (gameState === 'REVEAL_POPUP') {
//       setGameState('BREAK');
//       setTimeLeft(breakTime);
//     } else if (gameState === 'BREAK') {
//       setLevel((l) => l + 1);
//       generateGrid();
//       setGameState('PLAYING');
//       setTimeLeft(playTime);
//     }
//   };

//   const getProgressWidth = () => {
//     let max;
//     if (gameState === 'PLAYING') max = playTime;
//     else if (gameState === 'BREAK') max = breakTime;
//     else if (gameState === 'REVEAL_HIGHLIGHT') max = revealHighlightTime;
//     else max = revealPopupTime;
    
//     return `${(timeLeft / max) * 100}%`;
//   };

//   const isRevealed = gameState === 'REVEAL_HIGHLIGHT' || gameState === 'REVEAL_POPUP';

//   return (
//     <div className="fixed inset-0 bg-black flex justify-center items-center font-sans overflow-hidden">
      
//       {/* Mobile Frame */}
//       <div className="w-full max-w-md bg-white h-[100dvh] flex flex-col relative overflow-hidden">
        
//         {/* --- Top Bar --- */}
//         <div className="bg-gray-900 text-white px-4 py-2 flex justify-between items-center shrink-0 z-20 shadow-md">
//           <span className="font-bold text-yellow-400">LEVEL {level}</span>
//           <div className="flex items-center gap-2">
//             <span className="text-xs text-gray-400 uppercase">
//               {gameState === 'BREAK' ? 'Next In' : isRevealed ? 'Answer' : 'Time Left'}
//             </span>
//             <span className={`text-xl font-mono font-bold ${timeLeft <= 5 && gameState === 'PLAYING' ? 'text-red-500' : 'text-white'}`}>
//               {timeLeft}s
//             </span>
//           </div>
//         </div>

//         {/* --- Progress Bar --- */}
//         <div className="h-1 bg-gray-200 w-full shrink-0">
//           <div 
//             className="h-full bg-red-600 transition-all duration-1000 ease-linear"
//             style={{ width: getProgressWidth() }}
//           />
//         </div>

//         {/* --- POPUP --- */}
//         {gameState === 'REVEAL_POPUP' && (
//           <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 animate-in fade-in duration-300">
//             <div className="bg-white border-4 border-red-600 rounded-xl p-8 shadow-2xl transform scale-110 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300">
//               <div className="text-red-600 font-extrabold text-2xl uppercase mb-2 tracking-widest">Answer</div>
//               <div className="flex flex-col gap-1">
//                 {/* <div className="text-5xl font-black text-gray-900">
//                   ROW <span className="text-red-600">{answerCoords.row}</span>
//                 </div>
//                 <div className="h-1 w-full bg-gray-200 my-2 rounded-full"></div>
//                 <div className="text-5xl font-black text-gray-900">
//                   COL <span className="text-red-600">{answerCoords.col}</span>
//                 </div> */}

//                 <div className="text-5xl font-black text-gray-900">
//                    <span className="text-red-600">{answerCoords.row}</span>,<span className="text-red-600">{answerCoords.col}</span>
//                 </div>

//               </div>
//             </div>
//           </div>
//         )}

//         {/* --- GAME CONTENT --- */}
//         {gameState === 'BREAK' ? (
//           <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 text-white animate-in fade-in">
//              <h2 className="text-2xl font-bold mb-4">Next Puzzle Coming...</h2>
//              <div className="text-6xl font-black text-yellow-400 mb-2">{timeLeft}</div>
//           </div>
//         ) : (
//           <div className="flex-1 flex flex-col pt-2 pb-2 px-1 relative items-center">
            
//             {/* Header Title */}
//             <div className="text-center mb-2 shrink-0">
//                <h1 className="text-3xl font-extrabold tracking-tight text-black">
//                  FIND ={'>'} <span className="underline decoration-4 underline-offset-4">{targetNumber}</span>
//                </h1>
//             </div>

//             {/* --- LOCKED GRID STRUCTURE --- */}
//             {/* We use a table-like structure with flexbox to ensure perfect alignment */}
//             <div className="flex flex-col items-center">
              
//               {/* 1. Column Headers Row */}
//               <div className="flex mb-1">
//                  {/* Empty corner spacer to align with row numbers */}
//                  <div className="w-6 mr-1"></div> 
//                  {/* Columns 1-10 */}
//                  <div className="flex gap-x-1">
//                    {Array.from({ length: cols }, (_, i) => (
//                      <div key={i} className={`w-7 text-[10px] text-center font-mono text-gray-400 ${isRevealed && (i + 1) === answerCoords.col ? 'text-red-600 font-bold' : ''}`}>
//                        {i + 1}
//                      </div>
//                    ))}
//                  </div>
//               </div>

//               {/* 2. Main Rows Loop */}
//               {Array.from({ length: rows }, (_, rowIndex) => (
//                 <div key={rowIndex} className="flex items-center mb-0.5">
                  
//                   {/* Left Sidebar: Row Number */}
//                   <div className={`w-6 mr-1 text-[10px] text-right pr-1 font-mono text-gray-400 ${isRevealed && (rowIndex + 1) === answerCoords.row ? 'text-red-600 font-bold' : ''}`}>
//                     {rowIndex + 1}
//                   </div>

//                   {/* Grid Numbers for this Row */}
//                   <div className="flex gap-x-1">
//                     {gridNumbers.slice(rowIndex * cols, (rowIndex + 1) * cols).map((num, colIndex) => {
//                       const absoluteIndex = rowIndex * cols + colIndex;
//                       const isTarget = absoluteIndex === targetIndex;
//                       const isHighlighted = isRevealed && isTarget;
//                       const isDimmed = isRevealed && !isTarget;

//                       return (
//                         <div
//                           key={colIndex}
//                           className={`
//                             w-7 h-7 flex items-center justify-center
//                             text-center font-bold text-lg select-none leading-none
//                             transition-all duration-500
//                             ${isHighlighted ? 'bg-red-600 text-white rounded shadow-sm z-10 scale-110' : ''}
//                             ${isDimmed ? 'opacity-30 blur-[1px]' : 'text-gray-900'}
//                           `}
//                         >
//                           {num}
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               ))}
//             </div>

//           </div>
//         )}

//         {/* Footer */}
//         <div className="pb-4 pt-1 text-center shrink-0 bg-white z-10">
//              <div className="flex justify-center items-center gap-2 text-gray-400 text-xs font-medium tracking-wide">
//                 <span>PRISM Live</span>
//              </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default AutoPlayGame;





import React, { useState, useEffect } from 'react';

// Helper: Generates a random number between 10 and 99
const getRandomTwoDigit = () => Math.floor(Math.random() * 90) + 10;

const FindTheNumberGame = ({
  rows = 25,
  cols = 11,
  playTime = 20, 
  breakTime = 5,
  revealHighlightTime = 4,
  revealPopupTime = 4,
}) => {
  const totalItems = rows * cols;
  
  const [gameState, setGameState] = useState('PLAYING');
  const [timeLeft, setTimeLeft] = useState(playTime);
  const [level, setLevel] = useState(1);
  
  // Game Data State
  const [gridNumbers, setGridNumbers] = useState([]);
  const [targetIndex, setTargetIndex] = useState(null);
  const [answerCoords, setAnswerCoords] = useState({ row: 0, col: 0 });
  
  // Dynamic Numbers State
  const [currentConfig, setCurrentConfig] = useState({
    target: 42,
    common: 24
  });

  const generateGrid = () => {
    // --- 1. RANDOMIZE NUMBERS LOGIC ---
    
    // A. Pick a Target (10-99)
    const newTarget = getRandomTwoDigit();

    // B. Pick a Common Number (Must be different from Target)
    let newCommon;
    do {
      newCommon = getRandomTwoDigit();
    } while (newCommon === newTarget);

    // C. Pick Distractors (Must be different from Target and Common)
    const newDistractors = [];
    while (newDistractors.length < 3) {
      const d = getRandomTwoDigit();
      if (d !== newTarget && d !== newCommon && !newDistractors.includes(d)) {
        newDistractors.push(d);
      }
    }

    // Update state so UI knows what to show in header
    setCurrentConfig({ target: newTarget, common: newCommon });

    // --- 2. BUILD GRID ---
    let newGrid = new Array(totalItems).fill(newCommon);

    // Add distractors (scattered randomly)
    for (let i = 0; i < totalItems * 0.05; i++) {
      const r = Math.floor(Math.random() * totalItems);
      newGrid[r] = newDistractors[Math.floor(Math.random() * newDistractors.length)];
    }

    // Place Target
    const tIndex = Math.floor(Math.random() * totalItems);
    newGrid[tIndex] = newTarget;

    const row = Math.floor(tIndex / cols) + 1;
    const col = (tIndex % cols) + 1;

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
      setGameState('REVEAL_HIGHLIGHT');
      setTimeLeft(revealHighlightTime);
    } else if (gameState === 'REVEAL_HIGHLIGHT') {
      setGameState('REVEAL_POPUP');
      setTimeLeft(revealPopupTime);
    } else if (gameState === 'REVEAL_POPUP') {
      setGameState('BREAK');
      setTimeLeft(breakTime);
    } else if (gameState === 'BREAK') {
      setLevel((l) => l + 1);
      generateGrid(); // <--- This will now trigger new random numbers
      setGameState('PLAYING');
      setTimeLeft(playTime);
    }
  };

  const getProgressWidth = () => {
    let max;
    if (gameState === 'PLAYING') max = playTime;
    else if (gameState === 'BREAK') max = breakTime;
    else if (gameState === 'REVEAL_HIGHLIGHT') max = revealHighlightTime;
    else max = revealPopupTime;
    
    return `${(timeLeft / max) * 100}%`;
  };

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

        {/* --- POPUP --- */}
        {gameState === 'REVEAL_POPUP' && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 animate-in fade-in duration-300">
            <div className="bg-white border-4 border-red-600 rounded-xl p-8 shadow-2xl transform scale-110 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300">
              <div className="text-red-600 font-extrabold text-2xl uppercase mb-2 tracking-widest">Answer</div>
              <div className="flex flex-col gap-1">
                {/* <div className="text-5xl font-black text-gray-900">
                  ROW <span className="text-red-600">{answerCoords.row}</span>
                </div>
                <div className="h-1 w-full bg-gray-200 my-2 rounded-full"></div>
                <div className="text-5xl font-black text-gray-900">
                  COL <span className="text-red-600">{answerCoords.col}</span>
                </div> */}
                 <div className="text-5xl font-black text-gray-900">
                    <span className="text-red-600">{answerCoords.row}</span>,<span className="text-red-600">{answerCoords.col}</span>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* --- GAME CONTENT --- */}
        {gameState === 'BREAK' ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 text-white animate-in fade-in">
             <h2 className="text-2xl font-bold mb-4">Next Puzzle Coming...</h2>
             <div className="text-6xl font-black text-yellow-400 mb-2">{timeLeft}</div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col pt-2 pb-2 px-1 relative items-center">
            
            {/* Header Title (Updated to use currentConfig.target) */}
            <div className="text-center mb-2 shrink-0">
               <h1 className="text-3xl font-extrabold tracking-tight text-black">
                 FIND ={'>'} <span className="underline decoration-4 underline-offset-4">{currentConfig.target}</span>
               </h1>
            </div>

            {/* --- LOCKED GRID STRUCTURE --- */}
            <div className="flex flex-col items-center">
              
              {/* 1. Column Headers Row */}
              <div className="flex mb-1">
                 <div className="w-6 mr-1"></div> 
                 <div className="flex gap-x-1">
                   {Array.from({ length: cols }, (_, i) => (
                     <div key={i} className={`w-7 text-[10px] text-center font-mono text-gray-400 ${isRevealed && (i + 1) === answerCoords.col ? 'text-red-600 font-bold' : ''}`}>
                       {i + 1}
                     </div>
                   ))}
                 </div>
              </div>

              {/* 2. Main Rows Loop */}
              {Array.from({ length: rows }, (_, rowIndex) => (
                <div key={rowIndex} className="flex items-center mb-0.5">
                  
                  {/* Left Sidebar: Row Number */}
                  <div className={`w-6 mr-1 text-[10px] text-right pr-1 font-mono text-gray-400 ${isRevealed && (rowIndex + 1) === answerCoords.row ? 'text-red-600 font-bold' : ''}`}>
                    {rowIndex + 1}
                  </div>

                  {/* Grid Numbers */}
                  <div className="flex gap-x-1">
                    {gridNumbers.slice(rowIndex * cols, (rowIndex + 1) * cols).map((num, colIndex) => {
                      const absoluteIndex = rowIndex * cols + colIndex;
                      const isTarget = absoluteIndex === targetIndex;
                      const isHighlighted = isRevealed && isTarget;
                      const isDimmed = isRevealed && !isTarget;

                      return (
                        <div
                          key={colIndex}
                          className={`
                            w-7 h-7 flex items-center justify-center
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
              ))}
            </div>

          </div>
        )}

        {/* Footer */}
        <div className="pb-4 pt-1 text-center shrink-0 bg-white z-10">
             <div className="flex justify-center items-center gap-2 text-gray-400 text-xs font-medium tracking-wide">
                <span>BRAIN UP is Live</span>
             </div>
        </div>

      </div>
    </div>
  );
};

export default FindTheNumberGame;