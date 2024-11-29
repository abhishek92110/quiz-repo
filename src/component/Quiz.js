import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';
import Nav from './Nav';

const MemoizedNav = React.memo(Nav);

function Quiz() {
  const [screenChangeCount, setScreenChangeCount] = useState(0);
  const [allQuestion, setAllQuestion] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timer, setTimer] = useState(0);
  const [marks, setMarks] = useState(0);
  const [startStatus, setStartStatus] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);

  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    getAllQuestion();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && startStatus) {
        handleScreenChange();
      }
    };

    const handleKeyDown = (event) => {
      if (
        (event.key === 'Tab' && (event.altKey || event.metaKey)) ||
        event.key === 'Meta'
      ) {
        event.preventDefault();
        handleScreenChange();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [startStatus, screenChangeCount]);

  const handleScreenChange = () => {
    setScreenChangeCount((prevCount) => {
      const newCount = prevCount + 1;

      if (newCount > 2) {
        alert('You changed the screen too many times! The quiz is rejected.');
        handleForceSubmit();
      } else {
        alert('You are not allowed to change the screen!');
      }

      return newCount;
    });
  };

  const getAllQuestion = async () => {
    setLoadingStatus(true);

    let response = await fetch('https://blockey.in:8000/get-question', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        category: localStorage.getItem('category'),
      },
    });

    response = await response.json();
    setLoadingStatus(false);
    setAllQuestion(response.question);
  };

  const handleOptionSelect = (option) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = option;
    setUserAnswers(updatedAnswers);
  };

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < allQuestion.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setTimer(60);
    }
  }, [currentQuestionIndex, allQuestion.length]);

  const handleForceSubmit = () => {
    setLoadingStatus(true);

    const question = allQuestion.map((q, index) => ({
      question: q.question,
      yourAnswer:
        screenChangeCount > 2 && index >= currentQuestionIndex
          ? 'Rejected'
          : userAnswers[index] || 'Not Answered',
      correctAnswer: q.type === 'subjective' ? 'N/A' : q.answer,
      type: q.type,
      points:
        screenChangeCount > 2 && index >= currentQuestionIndex
          ? 0
          : q.type === 'subjective'
          ? 'Pending'
          : userAnswers[index] === q.answer
          ? 1
          : 0,
    }));

    fetch('https://blockey.in:8000/save-quiz-question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: localStorage.getItem('token'),
      },
      body: JSON.stringify({
        question,
        category: localStorage.getItem('category'),
        status: false,
        marks: question.reduce((sum, q) => sum + (q.points === 1 ? 1 : 0), 0),
      }),
    });

    setTimeout(() => {
      setLoadingStatus(false);
      navigate('/quiz-result', {
        state: {
          allQuestion,
          userAnswers,
          marks: question.reduce((sum, q) => sum + (q.points === 1 ? 1 : 0), 0),
          totalQuestions: allQuestion.length,
          correctAnswers: question.filter((q) => q.points === 1).length,
          incorrectAnswers: allQuestion.length - question.filter((q) => q.points === 1).length,
        },
      });
    }, 2000);
  };

  const handleSubmit = async () => {
    setLoadingStatus(true);
    let totalMarks = 0;

    userAnswers.forEach((answer, index) => {
      if (
        allQuestion[index].type === 'objective' &&
        answer === allQuestion[index].answer
      ) {
        totalMarks += 1;
      }
    });

    setMarks(totalMarks);

    const question = allQuestion.map((q, index) => ({
      question: q.question,
      yourAnswer: userAnswers[index] || 'Not Answered',
      correctAnswer: q.type === 'subjective' ? 'N/A' : q.answer,
      type: q.type,
      points:
        q.type === 'subjective'
          ? 'Pending'
          : userAnswers[index] === q.answer
          ? 1
          : 0,
    }));

    await fetch('https://blockey.in:8000/save-quiz-question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: localStorage.getItem('token'),
      },
      body: JSON.stringify({
        question,
        category: localStorage.getItem('category'),
        status: true,
        marks: totalMarks,
      }),
    });

    setTimeout(() => {
      setLoadingStatus(false);
      navigate('/quiz-result', {
        state: {
          allQuestion,
          userAnswers,
          marks: totalMarks,
          totalQuestions: allQuestion.length,
          correctAnswers: totalMarks,
          incorrectAnswers: allQuestion.filter(
            (q, i) =>
              q.type === 'objective' && userAnswers[i] !== q.answer
          ).length,
        },
      });
    }, 2000);
  };

  useEffect(() => {
    if (startStatus && timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (startStatus && timer === 0 && currentQuestionIndex < allQuestion.length - 1) {
      handleNext(); // Only move to the next question when the quiz has started
    }
  
    return () => clearInterval(timerRef.current); // Clean up timer
  }, [timer, startStatus, currentQuestionIndex, handleNext, allQuestion.length]);
  

  const StartFunc = () => {
    setStartStatus(true);
    setTimer(60);
  };

  return (
    <div>
      <MemoizedNav status="student" />

      {loadingStatus && <Loading />}

      <div
        className={`quiz-container bg-cover-color ${
          loadingStatus && 'overlay'
        }`}
      >
        <div className="question-box">
          <div className="question-number">
            <div>
              <i className="info-icon">ℹ️</i> Question No.{' '}
              {currentQuestionIndex + 1} of {allQuestion.length}
            </div>
            <div className="timer">
              Time Left: {Math.floor(timer / 60)}:
              {String(timer % 60).padStart(2, '0')}
            </div>
          </div>

          {allQuestion.length > 0 && (
            <div>
              <div className="question-text">
                <p>{allQuestion[currentQuestionIndex].question}</p>
              </div>

              {allQuestion[currentQuestionIndex].type === 'subjective' ? (
                <textarea
                  placeholder="Write your answer here..."
                  disabled={!startStatus}
                  value={userAnswers[currentQuestionIndex] || ''}
                  onChange={(e) => {
                    const updatedAnswers = [...userAnswers];
                    updatedAnswers[currentQuestionIndex] = e.target.value;
                    setUserAnswers(updatedAnswers);
                  }}
                  rows="5"
                  cols="50"
                />
              ) : (
                <div className="options-container">
                  {['option1', 'option2', 'option3', 'option4'].map(
                    (option, index) => {
                      const optionLetter = ['A', 'B', 'C', 'D'][index];
                      return (
                        <div
                          key={option}
                          className="option"
                          onClick={() =>
                            handleOptionSelect(
                              allQuestion[currentQuestionIndex][option]
                            )
                          }
                        >
                          <input
                            type="radio"
                            name={`question-${currentQuestionIndex}`}
                            value={allQuestion[currentQuestionIndex][option]}
                            disabled={!startStatus}
                            checked={
                              userAnswers[currentQuestionIndex] ===
                              allQuestion[currentQuestionIndex][option]
                            }
                          />
                          <label>
                            {optionLetter}.{' '}
                            {allQuestion[currentQuestionIndex][option]}
                          </label>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        {startStatus && (
          <div className="navigation-buttons">
           {currentQuestionIndex === allQuestion.length - 1 ? (
                <button className="submit-btn next-btn" onClick={handleSubmit}>
                  Submit
                </button>
              ) : ( 
                startStatus && (
                  <button className="next-btn" onClick={handleNext}>
                    Next
                  </button>
                )
              )}
          </div>
        )}
        {!startStatus && allQuestion.length > 0 && (
          <button className="next-btn" onClick={StartFunc}>
            Start Quiz
          </button>
        )}
      </div>
    </div>
  );
}

export default Quiz;

