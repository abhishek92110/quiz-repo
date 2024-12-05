import React, { createContext, useState } from 'react';

// Create the context
export const AppContext = createContext();

// Create the provider component
export const AppProvider = ({ children }) => {
  const [loggedInStatus, setLoggedInStatus] = useState("admin")

  const updateLoggedinStatus = (data)=>{
    setLoggedInStatus(data)
  }

  const verifyAdmin = async()=>{

    let response = await fetch("https://blockey.in:8000/verify-admin", {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "token": localStorage.getItem("adminToken"),
      },
    });

    response = await response.json()

    return response
  }
  const verifyUser = async()=>{

    let response = await fetch("https://blockey.in:8000/verify-user", {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "token": localStorage.getItem("token"),
      },
    });

    response = await response.json()

    return response
  }

  const getAllCourse = async()=>{

    let allCourse = await fetch("https://blockey.in:8000/all-course", {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    });

    allCourse = await allCourse.json()

    let subCourse = [];

    allCourse.allCourse.map(data=>{
      data.subCourse.map(element=>{
        subCourse.push(element.course)
      })
    })

    return {allCourse:allCourse, subCourse:subCourse}

  }
  const getSubCourse = async()=>{

    console.log("sub course useContext=",localStorage.getItem("userCourse"))

    let subCourse = await fetch("https://blockey.in:8000/sub-course", {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "mainCourse":localStorage.getItem("userCourse")
      },
    });

    subCourse = await subCourse.json()

    return subCourse

  }

  const getExam = async(course, dateRange)=>{

    try{

    let examDetails = await fetch("https://blockey.in:8000/get-course-date-exam", {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "course":course,
        "startDate":dateRange.startDate,
        "endDate":dateRange.endDate
      },
    });

    examDetails = await examDetails.json()

    return examDetails
  }
  catch(error){
    return {status:false}
  }

  }


  return (
    <AppContext.Provider value={{ loggedInStatus, updateLoggedinStatus, verifyAdmin, verifyUser, getAllCourse, getSubCourse,getExam }}>
      {children}
    </AppContext.Provider>
  );
};
