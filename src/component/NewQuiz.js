import React, { useState } from 'react';
import '../css/QuizApp.css'; // Add styles here or in an external CSS file

const QuizApp = () => {
  const [category, setCategory] = useState('HTML');

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handlePlayNow = () => {
    alert(`Starting quiz in category: ${category}`);
    // Add logic to navigate or start the quiz here
  };

  return (
    <div className="quiz-app">
      <header className="quiz-header">
        <h1>QuizApp</h1>
      </header>
      <div className="quiz-container">
        <div className="quiz-content">
          <img
            src="https://img.icons8.com/ios/452/quiz.png" // Replace with your own image if needed
            alt="Quiz Icon"
            className="quiz-icon"
          />
          <h2>The Ultimate Quiz</h2>
          <p>In which category do you want to play the quiz?</p>
          <select value={category} onChange={handleCategoryChange}>
            <option value="HTML">HTML</option>
            <option value="CSS">CSS</option>
            <option value="JavaScript">JavaScript</option>
            {/* Add more categories if needed */}
          </select>
          <button onClick={handlePlayNow} className="play-button">
            <i className="fas fa-play"></i> Play Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizApp;
