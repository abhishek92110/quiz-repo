
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import Loading from "./Loading";
import Nav from "./Nav";

const UpdateMarks = () => {
  const [userAnswer, setUserAnswer] = useState([]);
  const [totalMarks, setTotalMarks] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState(false)
  const questionRefs = useRef([]); // Ref array to track questions

  const navigate = useNavigate(); // React Router navigation

  useEffect(() => {
    console.log("user answer");
    getUserAnswer();
  }, []);

  const submitMarks = async () => {
    try{
      
    setLoadingStatus(true)
    let saveQuestion = await fetch("https://blockey.in:8000/update-save-quiz-question", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
      body: JSON.stringify({
        question: userAnswer,
        category: localStorage.getItem("category"),
        id: localStorage.getItem("userId"),
        marks: totalMarks,
      }),
    });

    saveQuestion = await saveQuestion.json()
    if(saveQuestion.status){

      setTimeout(()=>{
        
        setLoadingStatus(false)
        navigate('/student-answer')

      },2000)

    }
  }
  catch(error){
      setLoadingStatus(false)
  }
  };

  const handleUpdate = (value, index, correctAnswer) => {
    const tempUserAnswer = [...userAnswer]; // Create a new copy of the array
    tempUserAnswer[index].points = value;
    tempUserAnswer[index].correctAnswer = correctAnswer; // Add the correct answer to the question

    let tempMarks = 0;
    tempUserAnswer.forEach((data) => {
      tempMarks = tempMarks + data.points;
    });

    setTotalMarks(tempMarks);
    // Update the specific index
    setUserAnswer(tempUserAnswer);

    console.log("handle update function", value, index, tempUserAnswer);
  };

  const getUserAnswer = async () => {

    let response = await fetch(
      "https://blockey.in:8000/get-save-quiz-question-admin",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          category: localStorage.getItem("userCourse"),
          id: localStorage.getItem("userId"),
        },
      }
    );

    response = await response.json();

    console.log("response =", response.userAnswer[0]);
    setTotalMarks(response.userAnswer[0].marks);
    setUserAnswer(response.userAnswer[0].question);
  };

  const scrollToPending = () => {
    const pendingIndex = userAnswer.findIndex((answer) => answer.points === "Pending"); // Find the first unanswered question
    if (pendingIndex !== -1 && questionRefs.current[pendingIndex]) {
      questionRefs.current[pendingIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (
    <>
      <Nav/>
      

      <div className="container">
        <div>
          
        </div>
        <div className="fixed-header">
          <div className="marks-section my-4">
            <strong>Marks : </strong>
            <span>{totalMarks}</span>
          </div>
         {loadingStatus && <Loading/>}
          <button className="btn btn-primary" onClick={scrollToPending}>
            Pending
          </button>
        </div>
<div className={`container ${loadingStatus && "overlay"}`}>
        {userAnswer &&
          userAnswer.map((data, index) => {
            return data.type === "subjective" ? (
              <div
                className="subjective-card bg-cover-color card my-2"
                key={index}
                ref={(el) => (questionRefs.current[index] = el)}
              >
                <div className="card-body">
                  <h5 className="card-title">Question {index + 1}</h5>

                  <div className="question-points-section">
                  <div>  <strong>Question : </strong>
                  <span className="card-text">{data.question}</span>
                  </div>
                  <div className="my-4">
                    <strong>Point</strong>
                    <strong className="mx-2">:</strong>
                    <span>{data.points}</span>
                  </div>
                  </div>
                  <strong>Given Answer : </strong>
                  <span>{data.yourAnswer}</span>

                  <div className="btn-point-section">
                    <div className="btn-container">
                      <button
                        className="btn btn-success"
                        onClick={() => {
                          handleUpdate(1, index, data.correctAnswer);
                        }}
                      >
                        Correct
                      </button>
                      <button
                        className="btn btn-danger mx-2"
                        onClick={() => {
                          handleUpdate(0, index, data.correctAnswer);
                        }}
                      >
                        Incorrect
                      </button>
                    </div>

                   

                    {/* Add a section to enter the correct answer */}
                    <div className="my-4">
                      <strong>Correct Answer:</strong>
                      <textarea
                        value={data.correctAnswer || ""}
                        onChange={(e) => {
                          const updatedAnswer = e.target.value;
                          handleUpdate(data.points, index, updatedAnswer);
                        }}
                        placeholder="Write the correct answer here"
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              
              <div
                className="objective-card  card my-4"
                key={index}
                ref={(el) => (questionRefs.current[index] = el)}
              >
                <div className="card-body">
                  <h5 className="card-title">Question {index + 1}</h5>

                  <div className="question-points-section">
                 <div> <strong>Question : </strong>
                  <span className="card-text">{data.question}</span>
                  </div>
                  <div className="my-4">
                    <strong>Point</strong>
                    <strong className="mx-2">:</strong>
                    <span>{data.points}</span>
                  </div>
                  </div>
                  <div>
                    <strong>Given Answer : </strong>
                    <span>{data.yourAnswer}</span>
                  </div>
                  <div className="my-4">
                    <strong>Correct Answer : </strong>
                    <span>{data.correctAnswer}</span>
                  </div>
                </div>
              </div>
            );
          })}
        <div className="c-center my-4">
          <button className="btn btn-warning" onClick={submitMarks}>
            Submit
          </button>
        </div>
      </div>
      </div>
    </>
  );
};

export default UpdateMarks;