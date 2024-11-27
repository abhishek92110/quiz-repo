import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable"; // For table generation
import Nav from "./Nav";
import Loading from "./Loading";

function Result() {
  const [activeTab, setActiveTab] = useState("stats"); // Set default tab to 'stats'
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(localStorage.getItem("category") || "software-testing");
  const [allCategory, setAllCategory] = useState([])
  const [animate, setAnimate] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false)

  let marks = "";
  let question = "";
  let totalQuestions;
  let correctAnswers;
  let incorrectAnswers;
  let percentage;
  let grade;

  useEffect(() => {
    // Reset data and fetch new data when category changes
    setAnimate(true);
    setQuizData([]);
    setLoading(true);
    fetchQuizData();
    

  }, [category]);

  useEffect(()=>{

  getAllCategory()

  },[])

  const getAllCategory =async()=>{
    let response = await fetch("http://localhost:8000/all-category", {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    });

    response = await response.json()
    console.log("response all category =",response)

    setAllCategory(response.allCategory)
  }

  const fetchQuizData = async () => {
    console.log("Selected category:", category);

    setLoadingStatus(true)

    try {
      const response = await fetch("http://localhost:8000/get-save-quiz-question", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          category,
          token: localStorage.getItem("token"),
        },
      });

      const data = await response.json();
      console.log("Fetched data:", data);

      setTimeout(()=>{
        console.log("set time out running")
        setLoadingStatus(false)
      },2000)

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
    console.log("Update marks:", data);
    marks = data.marks;
    question = data.question;
    totalQuestions = question.length;
    correctAnswers = question.filter((q) => q.points === 1).length;
    incorrectAnswers = totalQuestions - correctAnswers;
    percentage = ((marks / totalQuestions) * 100).toFixed(2);
    grade = percentage >= 60 ? "Pass" : "F";
  };

  // Generate PDF
  const downloadPDF = () => {
    if (!quizData) return;

    const { marks, question } = quizData;
    const totalQuestions = question.length;
    const correctAnswers = question.filter((q) => q.points === 1).length;
    const incorrectAnswers = totalQuestions - correctAnswers;
    const percentage = ((marks / totalQuestions) * 100).toFixed(2);
    const grade = percentage >= 60 ? "Pass" : "F";

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Quiz Results", 20, 20);

    // Add stats
    doc.setFontSize(12);
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

    doc.save("quiz-results.pdf");
  };

  if (loading) {
    return <Loading/>
  }

  return (
    <div>
      {/* Navbar */}
      <Nav />

{loadingStatus && <Loading/>}
      {/* Tab Navigation */}
      <div className={`${loadingStatus && "overlay"} ${animate ? "slide-in" : ""}`}>

      <div className="category-result-section ">
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
            {allCategory.length>0 && allCategory.map((data,index)=>{
              return(
                <option value={data.category}>{data.category}</option>
              )
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
              <div>Grade: {grade}</div>
              <div>Total Questions: {totalQuestions}</div>
              <div>Correct Answers: {correctAnswers}</div>
              <div>Incorrect Answers: {incorrectAnswers}</div>
              <div>Your Score: {percentage}% </div>
              <div>Passing Score: 60% </div>
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

export default Result;

// AIzaSyDSR2zCw-8XMPoUYsB1EaKVfCEZGZ2YCc8
