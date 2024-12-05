import React, { useEffect, useState, useContext } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable"; // For table generation
import Nav from "./Nav";
import { AppContext } from './context/AppContext';
import Loading from "./Loading";

function StudentResult() {
  const contextValue = useContext(AppContext);
  const [activeTab, setActiveTab] = useState("stats"); // Set default tab to 'stats'
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(localStorage.getItem("category") || "software-testing");
  const [subCourse, setSubCourse] = useState([]);
  const [animate, setAnimate] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [name, setName] = useState();
  const [marks, setMarks] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [grade, setGrade] = useState("F");

  useEffect(() => {
    // Reset data and fetch new data when category changes
    setAnimate(true);
    setQuizData([]);
    setLoading(true);
    fetchQuizData();
  }, [category]);

  useEffect(() => {
    getSubCourse();
  }, []);

  const getSubCourse = async()=>{
    console.log("get sub course")
    let data = await contextValue.getAllCourse();
  
    setSubCourse(data.subCourse)
  }

  const fetchQuizData = async () => {
        setLoadingStatus(true);

    try {
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

      const data = await response.json();
      console.log("Fetched data:", data);

      setTimeout(() => {
        console.log("set time out running");
        setLoadingStatus(false);
      }, 2000);

      if (data.status && data.userAnswer.length > 0) {
        setQuizData(data.userAnswer[0]); // Update state with fetched data
        updatemarks(data.userAnswer[0]);
        setName(data.userAnswer[0].username)
    setCategory(data.userAnswer[0].category)
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

    const totalQuestions = data.question.length;
    const correctAnswers = data.question.filter((q) => q.points === 1).length;
    const incorrectAnswers = totalQuestions - correctAnswers;
    const percentage = parseInt(((data.marks / totalQuestions) * 100).toFixed(2));
    console.log("Update marks func:", data, data.question.length,percentage);

    if(percentage>80){

      setGrade("A")

    }
    else if(percentage>70 && percentage<80){
      setGrade("B")
    }
    else if(percentage>60 && percentage<70){
      setGrade("C")
    }
    else if(percentage>=50 && percentage<60){
      console.log("else if percentage > 50")
      setGrade("C")
    }
    else{
      setGrade("F")
    }

    setMarks(data.marks);
    setTotalQuestions(totalQuestions);
    setCorrectAnswers(correctAnswers);
    setIncorrectAnswers(incorrectAnswers);
    setPercentage(percentage);
    // setGrade(grade);
  };

  // Generate PDF
  const downloadPDF = () => {
    if (!quizData) return;

    const { marks, question } = quizData;
    const totalQuestions = question.length;
    const correctAnswers = question.filter((q) => q.points === 1).length;
    const incorrectAnswers = totalQuestions - correctAnswers;
    const percentage = ((marks / totalQuestions) * 100).toFixed(2);
    // const grade = percentage >= 60 ? "Pass" : "F";

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Quiz Results", 20, 20);

    // Add stats
    doc.setFontSize(12);
    doc.text(`Name: ${name}`, 20, 30);
    doc.text(`Grade: ${grade}`, 20, 40);
    doc.text(`Total Questions: ${totalQuestions}`, 20, 50);
    doc.text(`Correct Answers: ${correctAnswers}`, 20, 60);
    doc.text(`Incorrect Answers: ${incorrectAnswers}`, 20, 70);
    doc.text(`Your Score: ${percentage}%`, 20, 80);
    doc.text(`Passing Score: 60%`, 20, 90);

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

    doc.save(`${name}-${category}-results.pdf`);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      {/* Navbar */}
      <Nav />

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
                  <option key={index} value={data}>{data}</option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Conditionally Render Stats or QNA */}
        {quizData && quizData.question && quizData.question.length > 0 ? (
          activeTab === "stats" ? (
            <div className="stats-container bg-cover-color">
              <h2>Learning is a journey. Keep going, and you'll get there.</h2>
              <div className="stats-details">
                <div>Name: {name}</div>
                <div>Grade: {grade}</div>
                <div>Total Questions: {totalQuestions}</div>
                <div>Correct Answers: {correctAnswers}</div>
                <div>Incorrect Answers: {incorrectAnswers}</div>
                <div>Your Score: {percentage}%</div>
                <div>Passing Score: 60%</div>
              </div>
            </div>
          ) : (
            <div className="qna-container">
              <button className="pdf-button" onClick={downloadPDF}>
                Download PDF
              </button>
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

export default StudentResult;
  