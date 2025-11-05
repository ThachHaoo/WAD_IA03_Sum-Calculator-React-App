import React from 'react';
import SumCalculator from './components/SumCalculator';
import './App.css'; 

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <SumCalculator />
    </div>
  );
}

export default App;