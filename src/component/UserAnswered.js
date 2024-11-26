import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';
import Loading from './Loading';


const UserAnswered = () => {
    const [UserAnswer, setUserAnswer] = useState([])
    const [loadingStatus, setLoadingStatus] = useState(false)
    const [answerStatus, setAnswerStatus] = useState(false)

    const navigate = useNavigate();

    useEffect(()=>{

        getUnAnswerUser()

    },[answerStatus])

    const getUnAnswerUser = async()=>{
      setLoadingStatus(true)
        let data = await fetch("http://localhost:8000/get-user-saved-answer", {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              "status":answerStatus
            },
          });

          data  = await data.json()

          console.log("user answer =",data.userAnswer)
          setUserAnswer(data.userAnswer)

          setTimeout(()=>{

            setLoadingStatus(false)
          },[2000])
}

const handleShow = (data)=>{

    console.log("data =",data)
    localStorage.setItem('userId',data.user)
    localStorage.setItem('category',data.category)

    navigate("/update-marks")

}

  return (

    <>

<Nav/>
{loadingStatus && <Loading/>}

    <div className={`container my-4 ${loadingStatus && "overlay"}`}>

    <select
    
    className='custom-select my-4'
    value={answerStatus}
    onChange={(e)=>{setAnswerStatus(e.target.value)}}
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
      <th scope="col">View</th>
    </tr>
  </thead>
  <tbody>

{
    UserAnswer.length>0 && UserAnswer.map((data,index)=>{

        return(
            <tr>
                <td>{index+1}</td>
                <td>{data.username}</td>
                <td>{data.useremail}</td>
                <td>{data.category}</td>
                <td className='pointer' onClick={()=>handleShow(data)}><i class="fa-regular fa-eye"></i></td>
            </tr>
        )
    })
}
   
  </tbody>
</table>

    </div>
    </>
  )
}

export default UserAnswered