import React, { useState, useEffect, useRef } from 'react';
import FindTheNumberGame from './components/FindTheNumberGame.jsx';

function App() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const hideTimerRef = useRef(null);

  // 1. Sync state with browser events (e.g. if user presses ESC)
  useEffect(() => {
    const handleFsChange = () => {
      const isFs = !!document.fullscreenElement;
      setIsFullscreen(isFs);
      
      // If exiting full screen, make button permanently visible again
      if (!isFs) {
        setIsButtonVisible(true);
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      } else {
        // If entering full screen, start the hide timer
        resetHideTimer();
      }
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // 2. Logic to hide button after 3 seconds
  const resetHideTimer = () => {
    // Only auto-hide if we are in full screen
    if (!document.fullscreenElement) return;

    setIsButtonVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);

    hideTimerRef.current = setTimeout(() => {
      setIsButtonVisible(false);
    }, 3000); // Hide after 3 seconds
  };

  // 3. Global Interaction Listener (Clicking anywhere wakes up the button)
  useEffect(() => {
    const handleUserInteraction = () => {
      if (document.fullscreenElement) {
        resetHideTimer();
      }
    };

    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);
    
    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  const toggleFullScreen = async (e) => {
    e.stopPropagation(); // Prevent this click from immediately resetting the timer unnecessarily
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Error attempting to enable fullscreen:", err);
    }
  };

  return (
    <div className="relative">
      
      {/* The Toggle Button */}
      <button 
        onClick={toggleFullScreen}
        className={`
          fixed bottom-3 right-3 z-[100] 
          w-8 h-8 rounded-full 
          bg-black/50 text-white border border-white/30 backdrop-blur-md
          font-mono font-bold text-xl flex items-center justify-center shadow-lg
          transition-opacity duration-500 ease-in-out
          active:scale-95 active:bg-black/70
          ${isButtonVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      >
        {isFullscreen ? 'N' : 'F'}
      </button>

      {/* The Game */}
      <FindTheNumberGame />
    </div>
  );
}

export default App;