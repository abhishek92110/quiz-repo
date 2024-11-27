// import React, { useEffect, useState } from "react";
// import QuizBanner from '../image/quiz-banner2.png'
// import { useNavigate } from 'react-router-dom';
// import Nav from "./Nav";
// import Loading from "./Loading";

// // #ffd454

// const QuizHomePage = () => {

//   const [allCategory, setAllCategory] = useState([])
//   const [selectCategory, setCategory] = useState("")
//   const [loadingStatus, setLoadingStatus] = useState(false)
  

//   const navigate = useNavigate();

//   useEffect(()=>{

//     getAllCategory()

//   },[])

//   const handlePlay = ()=>{
//     setLoadingStatus(true)
//     setTimeout(()=>{
//       setLoadingStatus(false)
//       navigate('/quiz')
//     },2000)

//   }

//   const getAllCategory =async()=>{
//     let response = await fetch("http://localhost:8000/all-category", {
//       method: 'GET',
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     response = await response.json()
//     console.log("response all category =",response)

//     setAllCategory(response.allCategory)
//   }

//   return (
//     <>
//     <Nav/>
//     {loadingStatus && <Loading/>}
//     <div className={`bg-cover-color quiz-select ${loadingStatus && "overlay"}`}>

//       <main className="container mx-auto text-center py-10">
//         <div className="flex flex-col items-center mb-8">
//           <div className="">
//             <img src={QuizBanner}/>
//           </div>
//           <h2 className="text-3xl font-bold mb-4">
//             Get Ready for an Exciting Quiz Adventure!
//           </h2>
//           <div className="quiz-para-section">
//           <p className="text-lg mb-6">
//             Train your brain with smart, scientifically backed games that
//             enhance various cognitive functions. Start improving your mental
//             fitness with us today.
//           </p>
//           </div>
//           <button className="btn btn-warning" onClick={()=>handlePlay()}>
//             Start Quiz
//           </button>
//         </div>

//         <section>
//           <h3 className="text-2xl font-bold mb-6 my-4">Select a category</h3>
//           <div className="quiz-card">
//             {allCategory.length>0 && allCategory.map((data,index)=>{
//               return(
//                 <div class={`card ${selectCategory==data.category? "bg-warning":""}`} style={{"width":"18rem"}} onClick={(e)=>{setCategory(data.category);localStorage.setItem("category",data.category);}}>
//   <div class="card-body">
//     <h5 class="card-title">{data.category}</h5>
    
//     <p class="card-text">{data.totalQuestion}</p>
//   </div>
// </div>
//               )
//             })}
  
//           </div>
//         </section>
//       </main>
//     </div>
//     </>
//   );
// };

// const CategoryCard = ({ category, question }) => {
//   const [selectCategory, setCategory] = useState("")
//   return (
//     <>
//     <div class={`card ${selectCategory==category? "bg-warning":""}`} style={{"width":"18rem"}} onClick={(e)=>{setCategory(category);localStorage.setItem("category",category);}}>
//   <div class="card-body">
//     <h5 class="card-title">{category}</h5>
    
//     <p class="card-text">{question}</p>
//   </div>
// </div>
//     </>
//   );
// };

// export default QuizHomePage;


import React, { useEffect, useState } from "react";
import QuizBanner from '../image/quiz-banner2.png';
import { useNavigate } from 'react-router-dom';
import Nav from "./Nav";
import Loading from "./Loading";

const QuizHomePage = () => {
  const [allCategory, setAllCategory] = useState([]);
  const [selectCategory, setCategory] = useState("");
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [animate, setAnimate] = useState(false); // New state for animation

  const navigate = useNavigate();

  useEffect(() => {
    setAnimate(true); // Trigger animation on component mount
    getAllCategory();
  }, []);

  const handlePlay = () => {
    setLoadingStatus(true);
    setTimeout(() => {
      setLoadingStatus(false);
      navigate('/quiz');
    }, 2000);
  };

  const getAllCategory = async () => {
    let response = await fetch("http://localhost:8000/all-category", {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    });

    response = await response.json();
    console.log("response all category =", response);

    setAllCategory(response.allCategory);
  };

  return (
    <>
      <Nav />
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
              {allCategory.length > 0 && allCategory.map((data, index) => {
                return (
                  <div className={`card ${selectCategory === data.category ? "bg-warning" : ""}`} 
                    style={{ "width": "18rem" }} 
                    key={index} 
                    onClick={() => { 
                      setCategory(data.category); 
                      localStorage.setItem("category", data.category); 
                    }}>
                    <div className="card-body">
                      <h5 className="card-title">{data.category}</h5>
                      <p className="card-text">{data.totalQuestion}</p>
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
