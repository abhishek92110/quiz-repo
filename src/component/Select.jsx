import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';
import Nav from './Nav';

const QuizApp = () => {
  const [loadingStatus, setLoadingStatus] = useState(false)

  const navigate = useNavigate();


  useEffect(()=>{

    console.log("use effect running of select component")
    setDate()

  },[])

  const handlePlay = ()=>{
    setLoadingStatus(true)
    setTimeout(()=>{
      setLoadingStatus(false)
      navigate('/quiz')
    },2000)

  }

  const setDate=()=>{

    console.log("set date =")

    let date = new Date()
    let year = date.getFullYear();
    let month = (date.getMonth()+1).toString().padStart(2,'0')
    let day  = date.getDate().toString().padStart(2,0)

     let fullDate = `${year}-${month}-${day}`

     localStorage.setItem("date",fullDate)
  }
 
  return (
    <>

      <Nav status="student"/>

      {loadingStatus && <Loading/>}

    <div className="quiz-app">
    
      <div className={`quiz-main-container ${loadingStatus && "overlay"}`}>
        <div className="quiz-content">
          <img
            src="https://img.icons8.com/ios/452/quiz.png" // Replace with your own image if needed
            alt="Quiz Icon"
            className="quiz-icon"
          />
          <h2>The Ultimate Quiz</h2>
          <p>In which category do you want to play the quiz?</p>
          <select onChange={(e)=>{
            console.log("value select =",e.target.value);localStorage.setItem("category",e.target.value);
          }}>
            <option disabled selected>--- Select Category ---</option>
            <option value="html">HTML</option>
             <option value="css">CSS</option>
             <option value="javascript">Javascript</option>
            <option value="software-testing">Software Testing</option>
            {/* Add more categories if needed */}
          </select>
          <button className="play-button" onClick={handlePlay}>
            <i className="fas fa-play"></i> Play Now
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default QuizApp;