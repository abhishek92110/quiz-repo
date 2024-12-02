import React, { useEffect, useContext } from 'react'
import { AppContext } from './context/AppContext';

const Exam = () => {

    const contextValue = useContext(AppContext);

    useEffect(()=>{

        const year = new Date().getFullYear()
        const month = new Date().getMonth()+1
        const day = new Date().getDate().toString().padStart(2,'0');

        const date = `${year}-${month}-${day}`

        console.log("today date =",date)

        getExam("all",date)

    },[])

    const getExam = async(course, date)=>{
        
        const examDetails = await contextValue.getExam(course, date)
        console.log("exam details =",examDetails)
    }

  return (
    <div></div>
  )
}

export default Exam