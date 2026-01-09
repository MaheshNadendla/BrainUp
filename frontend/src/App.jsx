import FindTheNumberGame from "./components/FindTheNumberGame";


function App() {
  return (
    <FindTheNumberGame
      targetNumber={42} 
      commonNumber={24} 
      distractors={[23, 29, 25]} 
      title="BrainUp Games"
    />
  );
}

export default App;