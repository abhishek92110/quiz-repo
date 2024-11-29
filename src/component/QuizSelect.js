import React, { useEffect, useState, useContext } from "react";
import QuizBanner from '../image/quiz-banner2.png';
import { useNavigate } from 'react-router-dom';
import Nav from "./Nav";
import { AppContext } from './context/AppContext';
import Loading from "./Loading";

const QuizHomePage = () => {
  const contextValue = useContext(AppContext);
  const [subCourse, setSubCourse] = useState([]);
  const [selectCategory, setCategory] = useState("");
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [animate, setAnimate] = useState(false); // New state for animation

  const navigate = useNavigate();

  useEffect(() => {
    setAnimate(true); // Trigger animation on component mount
    getSubCourse();
    verifyUser();
  }, []);

  const verifyUser = async()=>{
   
      const response = await contextValue.verifyUser()

      if(!(response.status)){
          navigate('/register')
      }
  }
  

  const getSubCourse = async()=>{
    let data = await contextValue.getSubCourse();

    console.log("data of sub course =",data.subCourse[0].subCourse)

    setSubCourse(data.subCourse[0].subCourse)
  }

  const handlePlay = () => {
    setLoadingStatus(true);
    setTimeout(() => {
      setLoadingStatus(false);
      navigate('/quiz');
    }, 2000);
  };

 

  return (
    <>
      <Nav status="student" />
      {loadingStatus && <Loading />}
      <div className={`bg-cover-color quiz-select ${loadingStatus && "overlay"} ${animate ? "slide-in" : ""}`}>
        <main className="container mx-auto text-center py-10">
          <div className="flex flex-col items-center mb-8">
            <div className="">
              <img src={QuizBanner} />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Get Ready for an Exciting Quiz Adventure!
            </h2>
            <div className="quiz-para-section">
              <p className="text-lg mb-6">
                Train your brain with smart, scientifically backed games that
                enhance various cognitive functions. Start improving your mental
                fitness with us today.
              </p>
            </div>
            <button className="btn btn-warning" onClick={() => handlePlay()}>
              Start Quiz
            </button>
          </div>

          <section>
            <h3 className="text-2xl font-bold mb-6 my-4">Select a category</h3>
            <div className="quiz-card">
              {subCourse.length > 0 && subCourse.map((data, index) => {
                return (
                  <div className={`card ${selectCategory === data.course ? "bg-warning" : ""}`} 
                    style={{ "width": "18rem" }} 
                    key={index} 
                    onClick={() => { 
                      setCategory(data.course); 
                      localStorage.setItem("category", data.course); 
                    }}>
                    <div className="card-body">
                      <h5 className="card-title">{data.course}</h5>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default QuizHomePage;
