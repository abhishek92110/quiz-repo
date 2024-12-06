import React, { useEffect, useState, useContext } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable"; // For table generation
import Nav from "./Nav";
import { AppContext } from './context/AppContext';
import Loading from "./Loading";
import { useNavigate } from 'react-router-dom';

function Result() {
  const contextValue = useContext(AppContext);
  const [activeTab, setActiveTab] = useState("stats"); // Set default tab to 'stats'
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(localStorage.getItem("category") || "software-testing");
  const [subCourse, setSubCourse] = useState([]);
  const [animate, setAnimate] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [marks, setMarks] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [grade, setGrade] = useState("F");

  const navigate = useNavigate();

  useEffect(() => {
    // Reset data and fetch new data when category changes
    setAnimate(true);
    setQuizData([]);
    setLoading(true);
    fetchQuizData();
  }, [category]);

  useEffect(() => {
    getSubCourse();
    verifyUser()
  }, []);

  const verifyUser = async()=>{
   
    const response = await contextValue.verifyUser()

    if(!(response.status)){
        navigate('/register')
    }
}

const getSubCourse = async()=>{
  let data = await contextValue.getSubCourse();

  console.log("data of sub course of result=",data,data.subCourse[0].subCourse)

  setSubCourse(data.subCourse[0].subCourse)
}

  
 

  const fetchQuizData = async () => {
    console.log("Selected category:", category);

    setLoadingStatus(true);

    try {
      const response = await fetch("https://blockey.in:8000/get-save-quiz-question", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          category,
          token: localStorage.getItem("token"),
        },
      });

      const data = await response.json();
      console.log("Fetched data:", data);

      setTimeout(() => {
        console.log("set time out running");
        setLoadingStatus(false);
      }, 2000);

      if (data.status && data.userAnswer.length > 0) {
        setQuizData(data.userAnswer[0]); // Update state with fetched data
        updatemarks(data.userAnswer[0]);
      } else {
        setQuizData([]); // Clear state if no data is found
      }
    } catch (error) {
      console.error("Error fetching quiz data:", error);
    } finally {
      setLoading(false); // Ensure loading is false after fetch
    }
  };

  const updatemarks = (data) => {
    console.log("Update marks:", data, data.question.length);
    const totalQuestions = data.question.length;
    const correctAnswers = data.question.filter((q) => q.points === 1).length;
    const incorrectAnswers = totalQuestions - correctAnswers;
    const percentage = parseInt(((data.marks / totalQuestions) * 100).toFixed(2));


    percentage>=70?setGrade("Pass"):setGrade("Fail")

    setMarks(data.marks);
    setTotalQuestions(totalQuestions);
    setCorrectAnswers(correctAnswers);
    setIncorrectAnswers(incorrectAnswers);
    setPercentage(percentage);
  };

  // Generate PDF
  const downloadPDF = () => {
    if (!quizData) return;

    const { marks, question } = quizData;
    const totalQuestions = question.length;
    const correctAnswers = question.filter((q) => q.points === 1).length;
    const incorrectAnswers = totalQuestions - correctAnswers;
    const percentage = ((marks / totalQuestions) * 100).toFixed(2);
    // const grade = grade;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Quiz Results", 20, 10);

    console.log("quiz result pdf =",grade)

    // Add stats
    doc.setFontSize(12);
    doc.text(`Name: ${localStorage.getItem("name")}`, 20, 20);
    doc.text(`Result: ${grade}`, 20, 30);
    doc.text(`Course: ${category}`, 20, 40);
    doc.text(`Total Questions: ${totalQuestions}`, 20, 50);
    doc.text(`Correct Answers: ${correctAnswers}`, 20, 60);
    doc.text(`Incorrect Answers: ${incorrectAnswers}`, 20, 70);
    doc.text(`Your Score: ${percentage}%`, 20, 80);
    doc.text(`Passing Score: 70%`, 20, 90);

    // Add Q&A table
    doc.text("Question and Answers:", 20, 110);
    const tableData = question.map((q, index) => [
      index + 1,
      q.question,
      q.yourAnswer || "Not Answered",
      q.correctAnswer,
      q.points,
    ]);

    doc.autoTable({
      head: [["No.", "Question", "Your Answer", "Correct Answer", "Points"]],
      body: tableData,
      startY: 120,
    });

    doc.save("quiz-results.pdf");
  };

  if (loading) 
    {
    return <Loading />;
  }

  return (
    <div>
      {/* Navbar */}
     <Nav status="student"/>

      {loadingStatus && <Loading />}
      {/* Tab Navigation */}
      <div className={`${loadingStatus && "overlay"} ${animate ? "slide-in" : ""}`}>
        <div className="category-result-section">
          <div className="tabs">
            <button
              className={`tab-button ${activeTab === "stats" ? "active" : ""}`}
              onClick={() => setActiveTab("stats")}
            >
              Stats
            </button>
            <button
              className={`tab-button ${activeTab === "qna" ? "active" : ""}`}
              onClick={() => setActiveTab("qna")}
            >
              QNA
            </button>
          </div>

          <div className="category-select">
            <select
              className="custom-select"
              onChange={(e) => {
                const selectedCategory = e.target.value;
                localStorage.setItem("category", selectedCategory);
                setCategory(selectedCategory);
              }}
              value={category}
            >
              <option selected disabled>--- Select Category ---</option>
              {subCourse.length > 0 && subCourse.map((data, index) => {
                return (
                  <option key={index} value={data.course}>{data.course}</option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Conditionally Render Stats or QNA */}
        {console.log("inside design ",typeof(quizData.status))}
       {(quizData.status=="false") && <h1 className="c-center">Result is in Evaluation we will keep you update</h1>
}     
   {quizData && quizData.question && quizData.question.length > 0 ? (
          activeTab === "stats" ? (
            <div className="stats-container bg-cover-color">
              <h2>Learning is a journey. Keep going, and you'll get there.</h2>
              <div className="stats-details">
                <div className="result-div"><div><p className="student-detail-span">Name </p><b>:</b> <span>{localStorage.getItem("name")}</span></div></div>
                <div className="result-div"><div><p className="student-detail-span">Quiz Date </p><b>:</b><span>{quizData.date}</span></div></div>
                <div className="result-div"><div><p className="student-detail-span">Result </p><b>:</b><span>{quizData.status=="false"?"Pending":grade}</span></div></div>
                <div className="result-div"><div><p className="student-detail-span">Course </p><b>:</b><span>{category}</span></div></div>
                <div className="result-div"><div><p className="student-detail-span">Total Questions </p><b>:</b><span>{totalQuestions}</span></div></div>
                <div className="result-div"><div><p className="student-detail-span">Correct Answers </p><b>:</b><span>{quizData.status=="false"?"Pending":correctAnswers}</span></div></div>
                <div className="result-div"><div><p className="student-detail-span">Incorrect Answers </p><b>:</b><span>{quizData.status=="false"?"Pending":incorrectAnswers}</span></div></div>
                <div className="result-div"><div><p className="student-detail-span">Your Score </p><b>:</b><span>{quizData.status=="false"?"Pending":`${percentage}%`}</span></div></div>
                <div className="result-div"><div><p className="student-detail-span">Passing Score </p><b>:</b><span>70%</span></div></div>
              </div>
            </div>
          ) : (
            <div className="qna-container">

              {quizData.status=="true" && <button className="pdf-button" onClick={downloadPDF}>
                Download PDF
              </button>}
              <table>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Questions</th>
                    <th>Your Answers</th>
                    <th>Correct Answers</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {quizData.question.map((q, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{q.question}</td>
                      <td>{q.yourAnswer || "Not Answered"}</td>
                      <td>{q.correctAnswer}</td>
                      <td>{q.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div>No data available for the selected category.</div>
        )}
      </div>
    </div>
  );
}

export default Result;
