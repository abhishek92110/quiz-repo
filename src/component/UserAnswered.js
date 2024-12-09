import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { AppContext } from './context/AppContext';
import Nav from './Nav';
import Loading from './Loading';
import CustomDate from './CustomDate';


const UserAnswered = () => {
    const contextValue = useContext(AppContext);
    const [UserAnswer, setUserAnswer] = useState([])
    const [loadingStatus, setLoadingStatus] = useState(false)
    const [answerStatus, setAnswerStatus] = useState("false")
    const [date, setDate] = useState()
    const [course, setCourse]  = useState("all")
    const [subCourse, setSubCourse] = useState([])
    const [customRange, setCustomRange] = useState(false);
    const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

    const navigate = useNavigate();

    useEffect(()=>{
      const year = new Date().getFullYear()
      const month = new Date().getMonth()+1
      const day = new Date().getDate().toString().padStart(2,'0');

        const date = `${year}-${month}-${day}`

        let objDate = {
          startDate:formatDate(new Date()),
          endDate:formatDate(new Date())
        }

        getUnAnswerUser("all",false,objDate)
        setDateRange(objDate)

        setDate(date)

        verifyAmin()
        getAllCourse()
       
    },[])

    const verifyAmin = async()=>{
      const response = await contextValue.verifyAdmin()

      if(!(response.status)){
         navigate('/admin-login') 
      }
  }

  const getAllCourse = async()=>{
    const data = await contextValue.getAllCourse()
    console.log("data all course =",data)

    setSubCourse(data.subCourse)
  }


    const getUnAnswerUser = async(course,value,dateRange)=>{
      console.log("user answer route =",dateRange)
      setLoadingStatus(true)
        let data = await fetch("https://blockey.in:8000/get-user-saved-answer", {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              "status":value,
              "course":course,
              "startDate":dateRange.startDate,
              "endDate":dateRange.endDate
            },
          });

          data  = await data.json()

          console.log("user answer =",date,data,data.userAnswer)
          setUserAnswer(data.userAnswer)

          setTimeout(()=>{

            setLoadingStatus(false)
          },[2000])
}

const handleShow = (data)=>
  {

    console.log("data =",data)
    localStorage.setItem('userId',data.user)
    localStorage.setItem('category',data.category)
    localStorage.setItem("examDate",data.date)
    answerStatus=="false"?navigate("/update-marks"):navigate("/student-result")

}

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero
  const day = String(date.getDate()).padStart(2, '0'); // Add leading zero
  return `${year}-${month}-${day}`;
};


const handlePredefinedDate = (option) => {
  const today = new Date();
  let startDate, endDate;

  switch (option) {
      case "Today":
        setCustomRange(false)
          startDate = endDate = formatDate(today);
          break;

      case "Tomorrow":
        setCustomRange(false)
          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);
          startDate = endDate = formatDate(tomorrow);
          break;

      case "Yesterday":
        setCustomRange(false)
          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1);
          startDate = endDate = formatDate(yesterday);
          break;

      case "This Month":
        setCustomRange(false)
          // First and last day of the current month
          const firstDayThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          const lastDayThisMonth = new Date();
          startDate = formatDate(firstDayThisMonth);
          endDate = formatDate(lastDayThisMonth);
          break;

      case "Last Month":
        setCustomRange(false)
          // First and last day of the previous month
          const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
          const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
          startDate = formatDate(firstDayLastMonth);
          endDate = formatDate(lastDayLastMonth);
          break;

      case "Range":
            console.log("custom range ")
            setCustomRange(true)
            break;

      default:
          startDate = "";
          endDate = "";
  }

  console.log("Start date and end date =", startDate, endDate);
  setDateRange({ startDate, endDate });
  // setCustomRange(false);
};

return (

    <>

<Nav/>

{loadingStatus && <Loading/>}

    <div className={`container my-4 ${loadingStatus && "overlay"}`}>

<div className="course-date-section">

<select
                className="custom-select my-4"
                onChange={(e) => setCourse(e.target.value)}
            >
                <option disabled selected>--- Select Course ---</option>
                {subCourse.length > 0 &&
                    subCourse.map((data, index) => (
                        <option key={index} value={data}>
                            {data}
                        </option>
                    ))}
            </select>

            <div className="my-3">

                <select
                    className="custom-select"
                    onChange={(e) => handlePredefinedDate(e.target.value)}
                >
                    <option disabled selected>--- Select Date Option ---</option>
                    <option value="Today">Today</option>
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="Yesterday">Yesterday</option>
                    <option value="This Month">This Month</option>
                    <option value="Last Month">Last Month</option>
                    <option value="Range">Custom Range</option>
                </select>
            </div>

            {customRange && (
                <div className='start-end-section'>
                    <label className="mr-2">Start Date:</label>
                    <input
                        type="date"
                        onChange={(e) =>
                            setDateRange((prev) => ({ ...prev, startDate: e.target.value }))
                        }
                    />
                    <label className="mx-2">End Date:</label>
                    <input
                        type="date"
                        onChange={(e) =>
                            setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
                        }
                    />
                </div>
            )}

            <div className="">
                <button
                    className="btn btn-primary"
                    onClick={() => getUnAnswerUser(course, answerStatus, dateRange)}
                >
                    Search
                </button>
            </div>
        </div>

    <select
    
    className='custom-select my-4'
    value={answerStatus}
    onChange={(e)=>{setAnswerStatus(e.target.value);getUnAnswerUser(course,e.target.value,dateRange)}}
    >
            <option value="true">Done</option>
            <option value="false">Pending</option>
          </select>

<table class="table">
  <thead>
    <tr>
      <th scope="col">S No.</th>
      <th scope="col">Name</th>
      <th scope="col">Email</th>
      <th scope="col">Category</th>
      <th scope="col">{answerStatus=="false"?"View":"Result"}</th>
    </tr>
  </thead>
  <tbody>

{
    UserAnswer.length>0 && UserAnswer.map((data,index)=>
      {

        return(
            <tr>
                <td>{index+1}</td>
                <td>{data.username}</td>
                <td>{data.useremail}</td>
                <td>{data.category}</td>
                <td className='pointer' onClick={()=>handleShow(data)}>{answerStatus=="false"?<i class="fa-regular fa-eye"></i>:<i class="fa-solid fa-square-poll-horizontal"></i>}</td>
            </tr>
        )
    }
    )
}
   
  </tbody>
</table>

    </div>
    </>
  )
}

export default UserAnswered