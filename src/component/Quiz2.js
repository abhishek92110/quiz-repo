
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';
import Nav from './Nav';

function Quiz() {
  const [allQuestion, setAllQuestion] = useState([]); // All questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Current question index
  const [userAnswers, setUserAnswers] = useState([]); // Store user answers
  const [timer, setTimer] = useState(0); // Timer for each question
  const [marks, setMarks] = useState(0); // Marks
  const [startStatus, setStartStatus] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false); // Loading state
  const [screenAlertShown, setScreenAlertShown] = useState(false); // Track if the alert was show

  const navigate = useNavigate(); // React Router navigation


  useEffect(() => {
    getAllQuestion();
  
    // Handle visibility change to prevent screen switching
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && startStatus && !screenAlertShown) {
        alert("You are not allowed to change the screen!");
      }
    };
  
    // Handle copy event to disable text copying
    const handleCopy = (event) => {
      event.preventDefault();
      alert("Copying is disabled on this page!");
    };
  
    // Handle key combinations to prevent Alt+Tab and Win+Tab
    const handleKeyDown = (event) => {
      console.log("handle down key function is running")
      if (
        (event.key === "Tab" && (event.altKey || event.metaKey)) || // Alt+Tab or Win+Tab (metaKey for Mac)
       
        event.key === "Meta" // Prevent Win key
      ) {
        console.log("event key is running")
        event.preventDefault();
        alert("Switching windows is disabled during the quiz!");
      }
    };
  
    // Add event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("copy", handleCopy);
    window.addEventListener("keydown", handleKeyDown);
  
    // Cleanup function to remove event listeners on unmount
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("copy", handleCopy);
      window.removeEventListener("keydown", handleKeyDown);
    };
    
  }, [startStatus, screenAlertShown]);
  
  

  const getAllQuestion = async () => {

    setLoadingStatus(true)

    let response = await fetch("http://localhost:8000/get-question", {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "category": localStorage.getItem("category"),
      },
    });

    response = await response.json();

    setLoadingStatus(false)

    console.log("quiz question=",response)
    setAllQuestion(response.question);
    
  };

  const handleOptionSelect = (option) => {
    console.log("handle option =",option)
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = option;
    setUserAnswers(updatedAnswers);
  };

  const handleSubjectiveAnswer = (e) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = e.target.value;
    setUserAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < allQuestion.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimer(60);
    }
  };

  const handleSubmit = async () => {
    setLoadingStatus(true); // Start showing the loading bar
  
    let totalMarks = 0; // Total marks only for objective questions
  
    // Calculate marks only for objective questions
    userAnswers.forEach((answer, index) => {
      if (allQuestion[index].type === "objective" && answer === allQuestion[index].answer) {
        totalMarks += 1; // Increment marks for correct answers
      }
    });
  
    setMarks(totalMarks); // Set the total marks for objective questions
  
    // Prepare questions array for submission
    const question = allQuestion.map((q, index) => ({
      question: q.question,
      yourAnswer: userAnswers[index] || "Not Answered",
      correctAnswer: q.type === "subjective" ? "N/A" : q.answer,
      type: q.type,
      points: q.type === "subjective" ? "Pending" : (userAnswers[index] === q.answer ? 1 : 0), // Assign "Pending" for subjective
    }));
  
    // Save quiz data to backend
    await fetch("http://localhost:8000/save-quiz-question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
      body: JSON.stringify({
        question, // Question data
        category: localStorage.getItem("category"), // Category
        status:false,
        marks: totalMarks, // Marks only for objective questions
      }),
    });
  
    // Navigate to results after submission
    setTimeout(() => {
      setLoadingStatus(false)
      navigate("/quiz-result", {
        state: {
          allQuestion,
          userAnswers,
          marks: totalMarks,
          totalQuestions: allQuestion.length,
          correctAnswers: totalMarks, // Only for objective
          incorrectAnswers: allQuestion.filter((q, i) => q.type === "objective" && userAnswers[i] !== q.answer).length,
        },
      });
    }, 2000); // Simulate a 2-second loading time
  };
  



  useEffect(() => {
    if (timer > 0 && currentQuestionIndex < allQuestion.length) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else if (timer === 0 && currentQuestionIndex < allQuestion.length) {
      handleNext();
    }

    
  }, [timer, currentQuestionIndex]);

  const StartFunc = () => {
    setStartStatus(true);
    setTimer(60);
  };

 

  return (
    <div>
      <Nav/>

      {loadingStatus && <Loading/>}

      <div className={`quiz-container bg-cover-color ${loadingStatus && "overlay"}`}>
       
          <>
            <div className="question-box">
              <div className="question-number">
                <div>
                <i className="info-icon">ℹ️</i> Question No. {currentQuestionIndex + 1} of {allQuestion.length}
                </div>
                <div className="timer">
                Time Left: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
              </div>
              </div>

              {allQuestion.length > 0 && (
                <div>
                  <div className="question-text">
                    <p>{allQuestion[currentQuestionIndex].question}</p>
                  </div>

                  {allQuestion[currentQuestionIndex].type === "subjective" ?
                  (
                    <textarea
                      placeholder="Write your answer here..."
                      disabled={!startStatus}
                      value={userAnswers[currentQuestionIndex] || ""}
                      onChange={handleSubjectiveAnswer}
                      rows="5"
                      cols="50"
                    />
                  )
                   : 
                   (
                    <div className="options-container">
                      {['option1', 'option2', 'option3', 'option4'].map((option, index) => {
                        const optionLetter = ['A', 'B', 'C', 'D'][index];
                        return (
                          <div key={option} className="option" onClick={() => handleOptionSelect(allQuestion[currentQuestionIndex][option])} >
                            <input
                              type="radio"
                              name={`question-${currentQuestionIndex}`}
                              value={allQuestion[currentQuestionIndex][option]}
                              disabled={!startStatus}
                              checked={userAnswers[currentQuestionIndex] === allQuestion[currentQuestionIndex][option]}
                            />
                            <label>
                              {optionLetter}. {allQuestion[currentQuestionIndex][option]}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  )
                 
                  }
                </div>
              )}
            </div>

            <div className="footer">
             
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

              {!startStatus && (
                <button className="next-btn" onClick={StartFunc}>
                  Start
                </button>
              )}
            </div>
          </>
        
      </div>
    </div>
  );
}

export default Quiz;