// import React, { useEffect, useContext, useState } from 'react'
// import { AppContext } from './context/AppContext';
// import Nav from './Nav';

// const Exam = () => {

//     const contextValue = useContext(AppContext);
//     const [loadingStatus, setLoadingStatus] = useState(false)
//     const [examData, setExamData] = useState([])
//     const [subCourse, setSubCourse] = useState([])
//     const [course, setCourse] = useState("all")
//     const [date, setDate] = useState()

//     useEffect(()=>{

//         const year = new Date().getFullYear()
//         const month = new Date().getMonth()+1
//         const day = new Date().getDate().toString().padStart(2,'0');

//         const date = `${year}-${month}-${day}`

//         console.log("today date =",date)

//         getExam("all",date)

//         getAllCourse()

//     },[])

//     const getExam = async(course, date)=>{
        
//         const examDetails = await contextValue.getExam(course, date)
//         console.log("exam details =",examDetails)
//         setExamData(examDetails.data)
//     }

//     const getAllCourse = async()=>{
//       const data = await contextValue.getAllCourse()
//       console.log("data all course =",data)

//       setSubCourse(data.subCourse)
//     }

//     const handleShow = ()=>{

//     }

//   return (
//     <div>

// <Nav/>

// <div className={`container my-4 ${loadingStatus && "overlay"}`}>

// <div className='course-date-section'>
// <select

// className='custom-select my-4'
// onChange={(e)=>setCourse(e.target.value)}
// >
//   <option disabled selected>--- Select Course ---</option>
//   {subCourse.length>0 &&
//     subCourse.map(data=>{
//       return(
//         <option value={data}>{data}</option>
//       )
//     })
//   }
//       </select>
//       <div>
//         <input type="date" onChange={(e)=>setDate(e.target.value)}></input>
//       </div>
//       <div><button className='btn btn-primary' onClick={()=>getExam(course,date)}>Search</button></div>
//       </div>


// <table class="table">
// <thead>
// <tr>
//   <th scope="col">S No.</th>
//   <th scope="col">Course</th>
//   <th scope="col">Date</th>
//   <th scope="col">Status</th>
//   <th scope="col">View</th>
// </tr>
// </thead>
// <tbody>

// {
// examData.length>0 && examData.map((data,index)=>
//   {

//     return(
//         <tr>
//             <td>{index+1}</td>
//             <td>{data.category}</td>
//             <td>{data.date}</td>
//             <td className={`${data.status=="Active"?"bg-success":"bg-danger"} text-white`}>{data.status}</td>
//             <td className='pointer' onClick={()=>handleShow(data)}><i class="fa-regular fa-eye"></i></td>
//         </tr>
//     )
// }
// )
// }

// </tbody>
// </table>

// </div>

//     </div>
//   )
// }

// export default Exam


import React, { useEffect, useContext, useState } from "react";
import { AppContext } from "./context/AppContext";
import Nav from "./Nav";

const Exam = () => {
  const contextValue = useContext(AppContext);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [examData, setExamData] = useState([]);
  const [subCourse, setSubCourse] = useState([]);
  const [course, setCourse] = useState("all");
  const [date, setDate] = useState();

  useEffect(() => {
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().padStart(2, "0");
    const day = new Date().getDate().toString().padStart(2, "0");

    const todayDate = `${year}-${month}-${day}`;

    console.log("today date =", todayDate);

    getExam("all", todayDate);
    getAllCourse();
  }, []);

  const getExam = async (course, date) => {
    const examDetails = await contextValue.getExam(course, date);
    console.log("exam details =", examDetails);
    setExamData(examDetails.data);
  };

  const getAllCourse = async () => {
    const data = await contextValue.getAllCourse();
    console.log("data all course =", data);

    setSubCourse(data.subCourse);
  };

  const toggleStatus = (index) => {
    setExamData((prevData) =>
      prevData.map((item, idx) =>
        idx === index
          ? {
              ...item,
              status: item.status === "Active" ? "Deactive" : "Active",
            }
          : item
      )
    );
  };

  const handleShow = (data) => {
    console.log("View details:", data);
    // Add logic for handling "View" functionality.
  };

  return (
    <div>
      <Nav />

      <div className={`container my-4 ${loadingStatus && "overlay"}`}>
        <div className="course-date-section">
          <select
            className="custom-select my-4"
            onChange={(e) => setCourse(e.target.value)}
          >
            <option disabled selected>
              --- Select Course ---
            </option>
            {subCourse.length > 0 &&
              subCourse.map((data, index) => {
                return (
                  <option value={data} key={index}>
                    {data}
                  </option>
                );
              })}
          </select>
          <div>
            <input
              type="date"
              onChange={(e) => setDate(e.target.value)}
            ></input>
          </div>
          <div>
            <button
              className="btn btn-primary"
              onClick={() => getExam(course, date)}
            >
              Search
            </button>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th scope="col">S No.</th>
              <th scope="col">Course</th>
              <th scope="col">Date</th>
              <th scope="col">Status</th>
              <th scope="col">View</th>
            </tr>
          </thead>
          <tbody>
            {examData.length > 0 &&
              examData.map((data, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{data.category}</td>
                    <td>{data.date}</td>
                    <td
                      className={`pointer ${
                        data.status === "Active"
                          ? "bg-success"
                          : "bg-danger"
                      } text-white`}
                      onClick={() => toggleStatus(index)}
                    >
                      {data.status}
                    </td>
                    <td
                      className="pointer"
                      onClick={() => handleShow(data)}
                    >
                      <i className="fa-regular fa-eye"></i>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Exam;
